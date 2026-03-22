import Phaser from 'phaser';
import { TILE_SIZE, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, COLORS } from '../config';
import { Player } from '../entities/Player';
import { CharacterEntity } from '../entities/Character';
import { LocationEntity } from '../entities/Location';
import { FogOfWar } from '../systems/FogOfWar';
import { EncounterSystem } from '../systems/EncounterSystem';
import { LootSystem } from '../systems/LootSystem';
import { EconomySystem } from '../systems/EconomySystem';
import { HealthSystem } from '../systems/HealthSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { HUD } from '../ui/HUD';
import { DialogBox } from '../ui/DialogBox';
import { Minimap } from '../ui/Minimap';
import { PlayerState, createDefaultState, saveGame, loadGame, getOrCreateRevealedTiles } from '../utils/SaveManager';
import { locations } from '../data/locations';
import { getWeaponById, weapons } from '../data/weapons';
import { authors } from '../data/authors';
import { artists } from '../data/artists';
import { getStageConfig, type StageMapConfig } from '../data/stages';
import { TOTAL_CHARACTERS } from '../data/levels';
import type { ClassicalCharacter, GameItem } from '../data/types';
import { WikimediaService } from '../utils/WikimediaService';

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private fog!: FogOfWar;
  private hud!: HUD;
  private dialog!: DialogBox;
  private state!: PlayerState;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private eKey!: Phaser.Input.Keyboard.Key;
  private iKey!: Phaser.Input.Keyboard.Key;
  private bKey!: Phaser.Input.Keyboard.Key;
  private encounterSystem!: EncounterSystem;
  private lootSystem!: LootSystem;
  private economySystem!: EconomySystem;
  private healthSystem!: HealthSystem;
  private progressionSystem!: ProgressionSystem;
  private locationEntities: LocationEntity[] = [];
  private characterEntities: CharacterEntity[] = [];
  private allCharacters: ClassicalCharacter[] = [];
  private collisionMap: boolean[][] = [];
  private shopZones: { x: number; y: number; type: string; name: string }[] = [];
  private minimap!: Minimap;
  private inputLocked = false;
  private winStreak = 0;
  private pendingLoot: { items: { item: GameItem; quantity: number }[]; locationId: string; locationName: string } | null = null;
  private stageConfig!: StageMapConfig;
  private stageStartTime = 0;
  private grottoZone: { x: number; y: number } | null = null;
  private grottoPrompt!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'WorldScene' });
  }

  init(data: { newGame?: boolean }): void {
    if (data?.newGame) {
      this.state = createDefaultState();
    } else {
      this.state = loadGame() ?? createDefaultState();
    }
    // Reset state for fresh scene build
    this.locationEntities = [];
    this.characterEntities = [];
    this.shopZones = [];
    this.inputLocked = false;
    this.pendingLoot = null;
    this.winStreak = 0;
    this.stageStartTime = Date.now();
  }

  create(): void {
    this.allCharacters = [...authors, ...artists];
    this.stageConfig = getStageConfig(this.state.currentLevel);

    // Initialize systems
    this.encounterSystem = new EncounterSystem(this.allCharacters, this.state.capturedCharacters);
    this.lootSystem = new LootSystem();
    this.economySystem = new EconomySystem();
    this.healthSystem = new HealthSystem();
    this.progressionSystem = new ProgressionSystem(this.allCharacters);

    // Set allowed characters for this stage
    this.encounterSystem.setAllowedCharacters(this.stageConfig.characterIds);

    // Build the map for current stage
    this.buildMap();

    // Create player at stage spawn or saved position
    const pos = this.state.position;
    const isValidPos = pos.x >= 2 && pos.x < this.stageConfig.width - 2
      && pos.y >= 2 && pos.y < this.stageConfig.height - 2;
    const spawnX = isValidPos ? pos.x : this.stageConfig.spawnPoint.x;
    const spawnY = isValidPos ? pos.y : this.stageConfig.spawnPoint.y;
    this.player = new Player(this, spawnX, spawnY);

    // Create location entities for this stage
    this.createLocations();

    // Create shop zones
    this.createShopZones();

    // Create grotto
    this.createGrotto();

    // Spawn some visible characters
    this.spawnCharactersOnMap();

    // Fog of war with stage-specific dimensions
    const revealedTiles = getOrCreateRevealedTiles(
      this.state, this.stageConfig.stage, this.stageConfig.width, this.stageConfig.height
    );
    this.fog = new FogOfWar(this, this.stageConfig.width, this.stageConfig.height, revealedTiles);
    this.fog.reveal(this.player.tileX, this.player.tileY);

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, this.stageConfig.width * TILE_SIZE, this.stageConfig.height * TILE_SIZE);

    // HUD
    this.hud = new HUD(this);
    this.dialog = new DialogBox(this);
    this.minimap = new Minimap(this, this.stageConfig.width, this.stageConfig.height);
    this.updateHUD();
    this.updateMinimap();

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey('W'),
      A: this.input.keyboard!.addKey('A'),
      S: this.input.keyboard!.addKey('S'),
      D: this.input.keyboard!.addKey('D'),
    };
    this.eKey = this.input.keyboard!.addKey('E');
    this.iKey = this.input.keyboard!.addKey('I');
    this.bKey = this.input.keyboard!.addKey('B');

    // Switch to exploration music
    const music = this.scene.get('MusicScene') as import('./MusicScene').MusicScene;
    music.switchTrack('explore-music');

    // Listen for return from battle
    this.events.on('battle-result', this.handleBattleResult, this);
    this.events.on('shop-closed', () => { this.inputLocked = false; });
    this.events.on('grotto-read', (stage: number) => this.handleGrottoRead(stage));

    // Cleanup on shutdown (for scene.restart)
    this.events.once('shutdown', () => {
      this.fog?.destroy();
      this.minimap?.destroy();
      this.hud?.destroy();
      this.characterEntities.forEach(ce => ce.destroy());
      this.locationEntities.forEach(le => le.destroy());
      this.events.off('battle-result', this.handleBattleResult, this);
      this.input.keyboard?.removeAllKeys(true);
    });
  }

  update(): void {
    if (this.player.isMoving || this.inputLocked || this.dialog.isVisible()) return;

    // Movement
    let dx = 0, dy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown) { dx = -1; this.player.setFacing('left'); }
    else if (this.cursors.right.isDown || this.wasd.D.isDown) { dx = 1; this.player.setFacing('right'); }
    else if (this.cursors.up.isDown || this.wasd.W.isDown) { dy = -1; this.player.setFacing('up'); }
    else if (this.cursors.down.isDown || this.wasd.S.isDown) { dy = 1; this.player.setFacing('down'); }

    if (dx !== 0 || dy !== 0) {
      const newX = this.player.tileX + dx;
      const newY = this.player.tileY + dy;

      if (this.isPassable(newX, newY)) {
        this.player.moveToTile(newX, newY, () => {
          this.onPlayerMoved();
        });
      }
    }

    // Interaction
    if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.handleInteraction();
    }

    // Inventory
    if (Phaser.Input.Keyboard.JustDown(this.iKey)) {
      this.inputLocked = true;
      this.scene.launch('InventoryScene', { state: this.state, characters: this.allCharacters });
      this.scene.pause();
    }

    // Badges
    if (Phaser.Input.Keyboard.JustDown(this.bKey)) {
      this.inputLocked = true;
      this.scene.launch('BadgeScene', { state: this.state });
      this.scene.pause();
    }

    // Update location prompts
    this.updateLocationPrompts();
  }

  private onPlayerMoved(): void {
    this.state.position = { x: this.player.tileX, y: this.player.tileY };
    this.fog.reveal(this.player.tileX, this.player.tileY);
    this.state.revealedTiles[this.stageConfig.stage] = this.fog.revealedTiles;

    // Update character visibility
    this.characterEntities.forEach(ce => {
      ce.setVisible(this.fog.isTileRevealed(ce.tileX, ce.tileY));
    });

    // Check for character collision (walking onto a character)
    const touchedChar = this.characterEntities.find(
      ce => ce.tileX === this.player.tileX && ce.tileY === this.player.tileY && !ce.captured
    );
    if (touchedChar) {
      this.startBattle(touchedChar.characterData);
      return;
    }

    // No ambushes for the first 30 seconds of a stage -- let the player explore
    if (Date.now() - this.stageStartTime >= 30000) {
      // Check random encounter (exclude characters visible on the map)
      const visibleIds = new Set(
        this.characterEntities
          .filter(ce => !ce.captured && ce.visible)
          .map(ce => ce.characterData.id)
      );
      const encounter = this.encounterSystem.checkEncounter(
        this.player.stepCount, this.player.tileX, this.player.tileY,
        visibleIds
      );
      if (encounter) {
        // Switch to ambush music
        const ambushMusic = this.scene.get('MusicScene') as import('./MusicScene').MusicScene;
        ambushMusic.switchTrack('menu-music');
        this.dialog.show(
          `You've been ambushed by ${encounter.name}!`,
          () => this.startBattle(encounter)
        );
      }
    }

    // Update minimap
    this.updateMinimap();

    // Auto-save every 20 steps
    if (this.player.stepCount % 20 === 0) {
      saveGame(this.state);
    }
  }

  private startBattle(character: ClassicalCharacter): void {
    this.inputLocked = true;
    const levelConfig = this.progressionSystem.getCurrentLevel(this.state);
    const questionsRequired = levelConfig.questionsRequired[character.difficulty];
    this.scene.launch('BattleScene', {
      character,
      state: this.state,
      questionsRequired,
    });
    this.scene.pause();
  }

  private handleBattleResult(result: { won: boolean; character: ClassicalCharacter; gold: number }): void {
    this.inputLocked = false;
    this.scene.resume();

    // Switch back to exploration music
    const music = this.scene.get('MusicScene') as import('./MusicScene').MusicScene;
    music.switchTrack('explore-music');

    if (result.won) {
      this.state.capturedCharacters.push(result.character.id);
      this.state.gold += result.gold;
      this.state.stats.totalGoldEarned += result.gold;
      this.state.stats.totalBattlesWon++;
      this.winStreak++;

      // Remove captured character from map
      const entity = this.characterEntities.find(
        ce => ce.characterData.id === result.character.id
      );
      if (entity) {
        entity.captured = true;
        entity.destroy();
        this.characterEntities = this.characterEntities.filter(ce => ce !== entity);
      }

      this.encounterSystem.updateCaptured(this.state.capturedCharacters);

      this.hud.showToast(`Captured ${result.character.name}! +${result.gold} gold`);

      // Check victory
      if (this.state.capturedCharacters.length >= TOTAL_CHARACTERS) {
        saveGame(this.state);
        this.scene.start('VictoryScene', { state: this.state });
        return;
      }

      // Check level up (all stage characters captured + location looted)
      const newLevel = this.progressionSystem.checkLevelUp(this.state, this.stageConfig);
      if (newLevel) {
        this.handleLevelUp(newLevel);
        return; // scene will restart
      }

      // Check badges
      const newBadges = this.progressionSystem.checkNewBadges(this.state);
      for (const badge of newBadges) {
        this.state.badges.push(badge.id);
        this.hud.showToast(`Badge: ${badge.name} - ${badge.description}`);
      }

    } else {
      this.state.stats.totalBattlesLost++;
      this.winStreak = 0;
      const isDead = this.healthSystem.loseLife(this.state);

      if (isDead) {
        saveGame(this.state);
        this.scene.start('GameOverScene', { state: this.state });
        return;
      }

      this.hud.showToast(`${result.character.name} got away! Lost a life.`);
    }

    // Handle pending loot from guardian encounters
    if (this.pendingLoot) {
      if (result.won) {
        for (const loot of this.pendingLoot.items) {
          const existing = this.state.inventory.find(s => s.itemId === loot.item.id);
          if (existing) {
            existing.quantity += loot.quantity;
          } else {
            this.state.inventory.push({ itemId: loot.item.id, quantity: loot.quantity });
          }
        }
        this.state.lootedLocations[this.pendingLoot.locationId] =
          (this.state.lootedLocations[this.pendingLoot.locationId] ?? 0) + 1;

        const lootItems = this.pendingLoot.items;
        const locationName = this.pendingLoot.locationName;
        this.pendingLoot = null;

        this.showLootScreen(locationName, lootItems, () => {
          // Guardian loot may complete the stage
          const lvl = this.progressionSystem.checkLevelUp(this.state, this.stageConfig);
          if (lvl) {
            saveGame(this.state);
            this.handleLevelUp(lvl);
            return;
          }
          this.updateHUD();
          saveGame(this.state);
        });
        return;
      } else {
        this.hud.showToast('The guardian kept the loot!');
      }
      this.pendingLoot = null;
    }

    this.updateHUD();
    saveGame(this.state);
  }

  private handleLevelUp(newLevel: import('../data/levels').LevelConfig): void {
    this.state.currentLevel = newLevel.level;

    // Apply rewards
    if (newLevel.reward.goldBonus > 0) {
      this.state.gold += newLevel.reward.goldBonus;
      this.state.stats.totalGoldEarned += newLevel.reward.goldBonus;
    }
    if (newLevel.reward.maxLifeIncrease > 0) {
      this.state.maxLives = Math.min(this.state.maxLives + newLevel.reward.maxLifeIncrease, 10);
    }
    if (newLevel.reward.livesRestored > 0) {
      this.state.lives = Math.min(this.state.lives + newLevel.reward.livesRestored, this.state.maxLives);
    }

    // Set position to new stage spawn
    const newStage = getStageConfig(newLevel.level);
    this.state.position = { ...newStage.spawnPoint };

    saveGame(this.state);

    // Show level-up overlay, then restart scene with new stage
    this.showLevelUpOverlay(newLevel, newStage, () => {
      this.scene.restart({ newGame: false });
    });
  }

  private showLevelUpOverlay(
    level: import('../data/levels').LevelConfig,
    stage: StageMapConfig,
    onDismiss: () => void
  ): void {
    this.inputLocked = true;

    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9)
      .setDepth(200).setScrollFactor(0);

    const titleText = this.add.text(400, 120, 'LEVEL UP!', {
      fontSize: '36px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(201).setScrollFactor(0);

    const nameText = this.add.text(400, 180, `Level ${level.level}: ${level.name}`, {
      fontSize: '22px',
      color: '#eee8d5',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(201).setScrollFactor(0);

    const stageText = this.add.text(400, 215, `Entering: ${stage.name}`, {
      fontSize: '16px',
      color: '#c0a0ff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(201).setScrollFactor(0);

    // Rewards text
    const rewards: string[] = [];
    if (level.reward.goldBonus > 0) rewards.push(`+${level.reward.goldBonus} gold`);
    if (level.reward.livesRestored > 0) rewards.push(`+${level.reward.livesRestored} life restored`);
    if (level.reward.maxLifeIncrease > 0) rewards.push(`+${level.reward.maxLifeIncrease} max life`);

    const rewardStr = rewards.length > 0 ? rewards.join('  |  ') : '';
    const rewardText = this.add.text(400, 260, rewardStr, {
      fontSize: '14px',
      color: '#ffd700',
    }).setOrigin(0.5).setDepth(201).setScrollFactor(0);

    const messageText = this.add.text(400, 310, level.reward.message, {
      fontSize: '13px',
      color: '#cccccc',
      wordWrap: { width: 500 },
      align: 'center',
    }).setOrigin(0.5).setDepth(201).setScrollFactor(0);

    const continueText = this.add.text(400, 400, '[ Continue ]', {
      fontSize: '16px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(201).setScrollFactor(0).setInteractive({ useHandCursor: true });

    continueText.on('pointerover', () => continueText.setColor('#ffffff'));
    continueText.on('pointerout', () => continueText.setColor('#ffd700'));

    const dismiss = () => {
      overlay.destroy();
      titleText.destroy();
      nameText.destroy();
      stageText.destroy();
      rewardText.destroy();
      messageText.destroy();
      continueText.destroy();
      onDismiss();
    };

    continueText.on('pointerdown', dismiss);
    this.input.keyboard!.once('keydown-SPACE', dismiss);
  }

  private showLootScreen(
    locationName: string,
    lootItems: { item: GameItem; quantity: number }[],
    onDismiss: () => void
  ): void {
    this.inputLocked = true;
    const depth = 200;
    const fixedElements: Phaser.GameObjects.GameObject[] = [];

    // Full-screen overlay
    const overlay = this.add.rectangle(
      VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x000000, 0.92
    ).setDepth(depth).setScrollFactor(0);
    fixedElements.push(overlay);

    // Title
    const title = this.add.text(VIEWPORT_WIDTH / 2, 30, `Looted: ${locationName}`, {
      fontSize: '22px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(depth + 2).setScrollFactor(0);
    fixedElements.push(title);

    // Bottom bar
    const bottomBar = this.add.rectangle(
      VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 20, VIEWPORT_WIDTH, 40, 0x000000, 0.9
    ).setDepth(depth + 2).setScrollFactor(0);
    fixedElements.push(bottomBar);

    const continueText = this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 20, '[ SPACE ] Continue', {
      fontSize: '14px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(depth + 2).setScrollFactor(0).setInteractive({ useHandCursor: true });
    fixedElements.push(continueText);
    continueText.on('pointerover', () => continueText.setColor('#ffffff'));
    continueText.on('pointerout', () => continueText.setColor('#ffd700'));

    // Scrollable content container
    const contentContainer = this.add.container(0, 0).setDepth(depth + 1).setScrollFactor(0);
    fixedElements.push(contentContainer);

    // Mask so content doesn't overflow into header/footer
    // Offset by camera scroll since the container uses scrollFactor(0) (screen space)
    // but geometry masks operate in world space
    const contentTop = 60;
    const contentBottom = VIEWPORT_HEIGHT - 40;
    const cam = this.cameras.main;
    const maskGraphics = this.make.graphics({});
    maskGraphics.fillRect(cam.scrollX, contentTop + cam.scrollY, VIEWPORT_WIDTH, contentBottom - contentTop);
    const mask = maskGraphics.createGeometryMask();
    contentContainer.setMask(mask);
    fixedElements.push(maskGraphics);

    const rarityColors: Record<string, string> = {
      common: '#aaaaaa',
      uncommon: '#55bb55',
      rare: '#5599ff',
      legendary: '#ff99ff',
    };

    const margin = 60;
    const contentWidth = VIEWPORT_WIDTH - margin * 2;
    let y = contentTop + 10;

    for (const loot of lootItems) {
      const { item } = loot;
      const creator = this.allCharacters.find(c => c.id === item.creatorId);
      const creatorName = creator?.name ?? 'Unknown';
      const typeIcon = item.type === 'book' ? '📖' : '🎨';

      // Item name + quantity
      const nameStr = loot.quantity > 1 ? `${typeIcon} ${item.name} x${loot.quantity}` : `${typeIcon} ${item.name}`;
      contentContainer.add(this.add.text(margin, y, nameStr, {
        fontSize: '16px',
        color: rarityColors[item.rarity] ?? '#eee8d5',
        fontStyle: 'bold',
      }));

      // Value on the right
      contentContainer.add(this.add.text(VIEWPORT_WIDTH - margin, y, `${item.baseValue} gold`, {
        fontSize: '14px',
        color: '#ffd700',
      }).setOrigin(1, 0));

      y += 24;

      // Creator + year
      contentContainer.add(this.add.text(margin + 20, y, `by ${creatorName}, ${Math.abs(item.year)}${item.year < 0 ? ' BC' : ''}`, {
        fontSize: '12px',
        color: '#c0a0ff',
        fontStyle: 'italic',
      }));
      y += 20;

      // Description
      const descText = this.add.text(margin + 20, y, item.description, {
        fontSize: '12px',
        color: '#bbbbbb',
        wordWrap: { width: contentWidth - 20 },
        lineSpacing: 2,
      });
      contentContainer.add(descText);
      y += descText.height + 12;

      // Artwork image placeholder — loaded async
      if (item.type === 'artwork') {
        const imageY = y;
        const loadingText = this.add.text(margin + 20, y, 'Loading image...', {
          fontSize: '11px',
          color: '#666666',
        });
        contentContainer.add(loadingText);
        y += 160; // reserve space

        this.loadLootImage(item, creator, contentContainer, loadingText, margin + 20, imageY);
      }

      // Separator
      const sep = this.add.graphics();
      sep.lineStyle(1, 0x444444, 0.5);
      sep.lineBetween(margin, y, VIEWPORT_WIDTH - margin, y);
      contentContainer.add(sep);
      y += 15;
    }

    // Total value
    const totalValue = lootItems.reduce((sum, l) => sum + l.item.baseValue * l.quantity, 0);
    contentContainer.add(this.add.text(VIEWPORT_WIDTH / 2, y, `Total estimated value: ${totalValue} gold`, {
      fontSize: '14px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0));
    y += 30;

    // Scroll state
    const contentHeight = y - contentTop;
    const visibleHeight = contentBottom - contentTop;
    const maxScroll = Math.max(0, contentHeight - visibleHeight);
    let scrollY = 0;

    const updateScroll = () => {
      contentContainer.setY(-scrollY);
    };
    const scroll = (delta: number) => {
      scrollY = Math.max(0, Math.min(maxScroll, scrollY + delta));
      updateScroll();
    };

    // Scroll hint (only if content overflows)
    if (maxScroll > 0) {
      const scrollHint = this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 36, 'Scroll: Mouse Wheel / Arrow Keys', {
        fontSize: '10px',
        color: '#666666',
      }).setOrigin(0.5).setDepth(depth + 2).setScrollFactor(0);
      fixedElements.push(scrollHint);
    }

    // Wheel scroll
    const wheelHandler = (_pointer: Phaser.Input.Pointer, _over: Phaser.GameObjects.GameObject[], _dx: number, deltaY: number) => {
      scroll(deltaY > 0 ? 50 : -50);
    };
    this.input.on('wheel', wheelHandler);

    // Keyboard scroll via update event
    const scrollKeys = {
      up: this.input.keyboard!.addKey('UP'),
      down: this.input.keyboard!.addKey('DOWN'),
    };
    const updateHandler = () => {
      if (scrollKeys.down.isDown) scroll(4);
      else if (scrollKeys.up.isDown) scroll(-4);
    };
    this.events.on('update', updateHandler);

    // Dismiss
    const dismiss = () => {
      this.input.off('wheel', wheelHandler);
      this.events.off('update', updateHandler);
      this.input.keyboard!.removeKey('UP');
      this.input.keyboard!.removeKey('DOWN');
      contentContainer.setMask(null as unknown as Phaser.Display.Masks.GeometryMask);
      maskGraphics.destroy();
      for (const el of fixedElements) el.destroy();
      this.inputLocked = false;
      onDismiss();
    };

    continueText.on('pointerdown', dismiss);
    this.input.keyboard!.once('keydown-SPACE', dismiss);
  }

  private async loadLootImage(
    item: GameItem,
    creator: ClassicalCharacter | undefined,
    container: Phaser.GameObjects.Container,
    loadingText: Phaser.GameObjects.Text,
    x: number,
    y: number
  ): Promise<void> {
    const searchTerm = item.name;
    const creatorName = creator?.name;
    const imageUrl = await WikimediaService.getImageUrl(searchTerm, creatorName);
    if (!imageUrl || !this.scene.isActive()) return;

    const key = `loot-${item.id}`;
    const loaded = await WikimediaService.loadImageIntoPhaser(this, key, imageUrl);

    if (loaded && this.scene.isActive()) {
      loadingText.setText(item.name).setColor('#aaaaaa').setFontStyle('italic');

      const image = this.add.image(0, 0, key);
      const maxW = 240;
      const maxH = 140;
      const scale = Math.min(maxW / image.width, maxH / image.height, 1);
      image.setScale(scale);
      image.setOrigin(0, 0);
      image.setPosition(x, y + 18);
      container.add(image);
    } else if (this.scene.isActive()) {
      loadingText.setText(`${item.name} (image not found)`).setColor('#555555');
    }
  }

  private handleInteraction(): void {
    // Check nearby locations
    for (const loc of this.locationEntities) {
      if (loc.isPlayerAdjacent(this.player.tileX, this.player.tileY)) {
        this.interactWithLocation(loc);
        return;
      }
    }

    // Check shop zones
    for (const shop of this.shopZones) {
      const dx = Math.abs(this.player.tileX - shop.x);
      const dy = Math.abs(this.player.tileY - shop.y);
      if (dx <= 1 && dy <= 1) {
        this.enterShop(shop.type);
        return;
      }
    }

    // Check grotto (only enterable from the front / bottom side)
    if (this.grottoZone) {
      const px = this.player.tileX;
      const py = this.player.tileY;
      const frontY = this.grottoZone.y + 2; // row just below the 2x2 building
      if (py === frontY && px >= this.grottoZone.x && px <= this.grottoZone.x + 1) {
        this.enterGrotto();
        return;
      }
    }
  }

  private enterGrotto(): void {
    const hasStagCapture = this.stageConfig.characterIds.some(
      id => this.state.capturedCharacters.includes(id)
    );
    if (!hasStagCapture) {
      this.dialog.show('The Grotto of Knowledge is sealed. Capture at least one character in this era to unlock it.');
      return;
    }

    this.inputLocked = true;
    this.scene.launch('GrottoScene', { stageConfig: this.stageConfig });
    this.scene.pause();
  }

  private handleGrottoRead(stage: number): void {
    if (!this.state.grottoReadStages) {
      this.state.grottoReadStages = [];
    }
    if (this.state.grottoReadStages.includes(stage)) return;

    this.state.grottoReadStages.push(stage);
    const reward = 20;
    this.state.gold += reward;
    this.state.stats.totalGoldEarned += reward;
    this.hud.showToast(`Read the Grotto! +${reward} gold`);
    this.updateHUD();
    saveGame(this.state);
  }

  private interactWithLocation(loc: LocationEntity): void {
    // Each location can only be looted once per stage
    if (this.state.lootedLocations[loc.locationData.id]) {
      this.dialog.show(`You've already looted ${loc.locationData.name}. Nothing remains.`);
      return;
    }

    const weaponTier = this.state.equippedWeapon
      ? (getWeaponById(this.state.equippedWeapon)?.tier ?? 0)
      : 0;

    if (weaponTier < loc.locationData.requiredWeaponTier) {
      const needed = weapons.find(w => w.tier === loc.locationData.requiredWeaponTier);
      this.dialog.show(`You need a better weapon to loot ${loc.locationData.name}. Try the Blacksmith! (Need: ${needed?.name ?? 'better weapon'})`);
      return;
    }

    const weapon = this.state.equippedWeapon ? getWeaponById(this.state.equippedWeapon) : null;
    const multiplier = weapon?.lootBonusMultiplier ?? 1;
    const result = this.lootSystem.loot(loc.locationData, this.state.equippedWeapon, multiplier);

    // Check for guardian encounter BEFORE giving loot
    if (result.triggeredEncounter) {
      const guardian = this.encounterSystem.getRandomCharacter();
      if (guardian) {
        this.pendingLoot = { items: result.items, locationId: loc.locationData.id, locationName: loc.locationData.name };
        const itemNames = result.items.map(l => l.item.name).join(', ');
        this.dialog.show(
          `A guardian emerges from ${loc.locationData.name}! ${guardian.name} challenges you for the loot: ${itemNames}!`,
          () => this.startBattle(guardian)
        );
        return;
      }
    }

    // No encounter — add items to inventory immediately
    for (const loot of result.items) {
      const existing = this.state.inventory.find(s => s.itemId === loot.item.id);
      if (existing) {
        existing.quantity += loot.quantity;
      } else {
        this.state.inventory.push({ itemId: loot.item.id, quantity: loot.quantity });
      }
    }

    // Track looted location
    this.state.lootedLocations[loc.locationData.id] =
      (this.state.lootedLocations[loc.locationData.id] ?? 0) + 1;

    this.showLootScreen(loc.locationData.name, result.items, () => {
      // Check level up (looting may have been the final requirement)
      const newLevel = this.progressionSystem.checkLevelUp(this.state, this.stageConfig);
      if (newLevel) {
        saveGame(this.state);
        this.handleLevelUp(newLevel);
        return;
      }

      // Check badges
      const newBadges = this.progressionSystem.checkNewBadges(this.state);
      for (const badge of newBadges) {
        this.state.badges.push(badge.id);
        this.hud.showToast(`Badge: ${badge.name}`);
      }

      this.updateHUD();
      saveGame(this.state);
    });
  }

  private enterShop(type: string): void {
    this.inputLocked = true;
    this.scene.launch('ShopScene', {
      shopType: type,
      state: this.state,
      onStateUpdate: (newState: PlayerState) => {
        this.state = newState;
        this.updateHUD();
        saveGame(this.state);
      },
    });
    this.scene.pause();
  }

  private updateLocationPrompts(): void {
    for (const loc of this.locationEntities) {
      const isNear = loc.isPlayerAdjacent(this.player.tileX, this.player.tileY);
      const isRevealed = this.fog.isTileRevealed(loc.tileX, loc.tileY);
      loc.setVisible(isRevealed);
      loc.interactPrompt.setVisible(isNear && isRevealed);
    }

    // Grotto prompt (only shows when standing at the front/bottom)
    if (this.grottoZone && this.grottoPrompt) {
      const px = this.player.tileX;
      const py = this.player.tileY;
      const frontY = this.grottoZone.y + 2;
      const atFront = py === frontY && px >= this.grottoZone.x && px <= this.grottoZone.x + 1;
      const isRevealed = this.fog.isTileRevealed(this.grottoZone.x, this.grottoZone.y);
      this.grottoPrompt.setVisible(atFront && isRevealed);
    }
  }

  private updateMinimap(): void {
    this.minimap.update(
      this.player.tileX,
      this.player.tileY,
      this.fog.revealedTiles,
      this.collisionMap,
      this.characterEntities,
      this.locationEntities
    );
  }

  private updateHUD(): void {
    const weaponName = this.state.equippedWeapon
      ? (getWeaponById(this.state.equippedWeapon)?.name ?? null)
      : null;
    const levelConfig = this.progressionSystem.getCurrentLevel(this.state);
    this.hud.update(this.state, weaponName, levelConfig, this.stageConfig);
  }

  // === MAP GENERATION ===

  private buildMap(): void {
    const { width, height, colors } = this.stageConfig;

    this.collisionMap = [];
    for (let x = 0; x < width; x++) {
      this.collisionMap[x] = new Array(height).fill(false);
    }

    const graphics = this.add.graphics();

    // Draw ground tiles
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const isAlt = (x + y) % 7 === 0 || (x * 3 + y * 5) % 11 === 0;
        const color = isAlt ? colors.grassAlt : colors.grass;
        graphics.fillStyle(color, 1);
        graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        // Map border = water (collision)
        if (x <= 1 || x >= width - 2 || y <= 1 || y >= height - 2) {
          graphics.fillStyle(colors.water, 1);
          graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          this.collisionMap[x][y] = true;
        }
      }
    }

    // Draw paths from stage config
    for (const [x1, y1, x2, y2] of this.stageConfig.paths) {
      this.drawPath(graphics, x1, y1, x2, y2);
    }

    // Water features
    for (const wf of this.stageConfig.waterFeatures) {
      this.drawWater(graphics, wf.cx, wf.cy, wf.w, wf.h);
    }

    // Forests
    for (const ff of this.stageConfig.forestFeatures) {
      this.drawForest(graphics, ff.cx, ff.cy, ff.w, ff.h);
    }

    // Safeguard: clear collision around the grotto and its entrance so it's always reachable.
    // The grotto is a 2x2 building; the entrance row is y+2. Clear a 1-tile buffer around
    // the building and the entire entrance row, redrawing as ground.
    const gp = this.stageConfig.grottoPosition;
    for (let dx = -1; dx <= 2; dx++) {
      for (let dy = -1; dy <= 3; dy++) {
        const tx = gp.x + dx;
        const ty = gp.y + dy;
        if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
          // Don't clear the 2x2 building itself (collision is set later in createGrotto)
          const isBuilding = dx >= 0 && dx <= 1 && dy >= 0 && dy <= 1;
          if (!isBuilding) {
            this.collisionMap[tx][ty] = false;
            graphics.fillStyle(colors.path, 1);
            graphics.fillRect(tx * TILE_SIZE, ty * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    }

    graphics.setDepth(0);
  }

  private drawPath(graphics: Phaser.GameObjects.Graphics, x1: number, y1: number, x2: number, y2: number): void {
    const { width, height, colors } = this.stageConfig;
    const midX = x2;
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      for (let w = -1; w <= 1; w++) {
        const py = y1 + w;
        if (py >= 0 && py < height && x >= 0 && x < width) {
          graphics.fillStyle(colors.path, 1);
          graphics.fillRect(x * TILE_SIZE, py * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          this.collisionMap[x][py] = false;
        }
      }
    }
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      for (let w = -1; w <= 1; w++) {
        const px = midX + w;
        if (px >= 0 && px < width && y >= 0 && y < height) {
          graphics.fillStyle(colors.path, 1);
          graphics.fillRect(px * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          this.collisionMap[px][y] = false;
        }
      }
    }
  }

  private drawWater(graphics: Phaser.GameObjects.Graphics, cx: number, cy: number, w: number, h: number): void {
    const { width, height, colors } = this.stageConfig;
    for (let x = cx - w; x <= cx + w; x++) {
      for (let y = cy - h; y <= cy + h; y++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const dist = ((x - cx) / w) ** 2 + ((y - cy) / h) ** 2;
          if (dist <= 1) {
            graphics.fillStyle(colors.water, 1);
            graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            this.collisionMap[x][y] = true;
          }
        }
      }
    }
  }

  private drawForest(graphics: Phaser.GameObjects.Graphics, cx: number, cy: number, w: number, h: number): void {
    const { width, height, colors } = this.stageConfig;
    for (let x = cx; x < cx + w; x++) {
      for (let y = cy; y < cy + h; y++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          if ((x * 7 + y * 13) % 3 !== 0) {
            graphics.fillStyle(colors.forest, 1);
            graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            graphics.fillStyle(colors.forestTop, 1);
            graphics.fillCircle(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 3, 12);
            this.collisionMap[x][y] = true;
          }
        }
      }
    }
  }

  private createLocations(): void {
    const stageLocationIds = this.stageConfig.locationIds;
    const stagePositions = this.stageConfig.locationPositions;

    for (const loc of locations) {
      if (!stageLocationIds.includes(loc.id)) continue;

      // Override position with stage-specific position
      const pos = stagePositions[loc.id] ?? loc.position;
      const localLoc = { ...loc, position: pos };

      // Mark building tiles as collision
      for (let dx = 0; dx < 2; dx++) {
        for (let dy = 0; dy < 2; dy++) {
          const bx = pos.x + dx;
          const by = pos.y + dy;
          if (bx < this.stageConfig.width && by < this.stageConfig.height) {
            this.collisionMap[bx][by] = true;
          }
        }
      }

      const entity = new LocationEntity(this, localLoc);
      this.locationEntities.push(entity);
      entity.setVisible(false);
    }
  }

  private createShopZones(): void {
    this.shopZones = this.stageConfig.shopPositions;

    const graphics = this.add.graphics();
    graphics.setDepth(3);

    for (const shop of this.shopZones) {
      const sx = shop.x * TILE_SIZE;
      const sy = shop.y * TILE_SIZE;

      let color: number;
      let icon: string;
      switch (shop.type) {
        case 'blackmarket': color = 0x3a1a3a; icon = '💰'; break;
        case 'apothecary': color = 0x1a3a2a; icon = '🧪'; break;
        case 'blacksmith': color = 0x3a2a1a; icon = '⚔️'; break;
        default: color = 0x3a3a3a; icon = '🏠';
      }

      graphics.fillStyle(color, 1);
      graphics.fillRect(sx, sy, TILE_SIZE * 2, TILE_SIZE * 2);
      graphics.lineStyle(2, 0xffd700);
      graphics.strokeRect(sx, sy, TILE_SIZE * 2, TILE_SIZE * 2);

      this.add.text(sx + TILE_SIZE, sy - 10, shop.name, {
        fontSize: '9px',
        color: '#ffd700',
        backgroundColor: '#00000099',
        padding: { x: 2, y: 1 },
      }).setOrigin(0.5).setDepth(6);

      this.add.text(sx + TILE_SIZE, sy + TILE_SIZE, icon, {
        fontSize: '20px',
      }).setOrigin(0.5).setDepth(6);

      // Collision for shop building
      for (let dx = 0; dx < 2; dx++) {
        for (let dy = 0; dy < 2; dy++) {
          this.collisionMap[shop.x + dx][shop.y + dy] = true;
        }
      }
    }
  }

  private createGrotto(): void {
    const pos = this.stageConfig.grottoPosition;
    this.grottoZone = pos;

    const graphics = this.add.graphics();
    graphics.setDepth(3);

    const gx = pos.x * 32; // TILE_SIZE
    const gy = pos.y * 32;

    // Rocky hill background (larger mound)
    graphics.fillStyle(0x6b6b5b, 1);
    graphics.fillTriangle(gx - 8, gy + 64, gx + 32, gy - 10, gx + 72, gy + 64);
    // Darker rock layer
    graphics.fillStyle(0x5a5a4a, 1);
    graphics.fillTriangle(gx, gy + 64, gx + 32, gy + 4, gx + 64, gy + 64);

    // Cave entrance (dark opening)
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillEllipse(gx + 32, gy + 48, 32, 28);

    // Cave interior glow
    graphics.fillStyle(0xffd700, 0.15);
    graphics.fillEllipse(gx + 32, gy + 48, 24, 20);

    // Stalactites at cave top
    graphics.fillStyle(0x5a5a4a, 1);
    graphics.fillTriangle(gx + 20, gy + 34, gx + 23, gy + 42, gx + 26, gy + 34);
    graphics.fillTriangle(gx + 34, gy + 33, gx + 37, gy + 43, gx + 40, gy + 33);

    // Name label
    this.add.text(gx + 32, gy - 16, 'Grotto of Knowledge', {
      fontSize: '9px',
      color: '#ffd700',
      backgroundColor: '#00000099',
      padding: { x: 2, y: 1 },
    }).setOrigin(0.5).setDepth(6);

    // Interact prompt (hidden until adjacent)
    this.grottoPrompt = this.add.text(gx + 32, gy + 72, '[E] Enter Grotto', {
      fontSize: '10px',
      color: '#ffd700',
      backgroundColor: '#00000099',
      padding: { x: 3, y: 2 },
    }).setOrigin(0.5).setDepth(6).setVisible(false);

    // Mark collision for 2x2 area
    for (let dx = 0; dx < 2; dx++) {
      for (let dy = 0; dy < 2; dy++) {
        if (pos.x + dx < this.stageConfig.width && pos.y + dy < this.stageConfig.height) {
          this.collisionMap[pos.x + dx][pos.y + dy] = true;
        }
      }
    }
  }

  private spawnCharactersOnMap(): void {
    const { width, height } = this.stageConfig;

    // Only spawn characters assigned to this stage that haven't been captured
    const stageCharacters = this.allCharacters.filter(
      c => this.stageConfig.characterIds.includes(c.id) &&
        !this.state.capturedCharacters.includes(c.id)
    );

    // Don't re-spawn characters already on the map
    const alreadySpawnedIds = new Set(this.characterEntities.filter(ce => !ce.captured).map(ce => ce.characterData.id));
    const available = stageCharacters.filter(c => !alreadySpawnedIds.has(c.id));

    // Only place 1-2 characters visibly on the map; the rest are ambush-only
    // (encountered through the random encounter system)
    const maxVisible = Math.min(Math.max(1, Math.floor(available.length / 3)), 2);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const toSpawn = shuffled.slice(0, maxVisible);
    const usedPositions = new Set<string>();

    for (const char of toSpawn) {
      let tx: number, ty: number;
      let attempts = 0;

      // Place within map bounds (avoid borders), far from spawn to force exploration
      do {
        tx = 3 + Math.floor(Math.random() * (width - 6));
        ty = 3 + Math.floor(Math.random() * (height - 6));
        // Ensure placed at least 8 tiles from spawn point
        const distFromSpawn = Math.abs(tx - this.stageConfig.spawnPoint.x) + Math.abs(ty - this.stageConfig.spawnPoint.y);
        if (distFromSpawn < 8) { attempts++; continue; }
        attempts++;
      } while (
        (this.collisionMap[tx]?.[ty] || usedPositions.has(`${tx},${ty}`)) &&
        attempts < 80
      );

      if (attempts < 80) {
        usedPositions.add(`${tx},${ty}`);
        const entity = new CharacterEntity(this, tx, ty, char);
        entity.setVisible(this.fog?.isTileRevealed(tx, ty) ?? false);
        this.characterEntities.push(entity);
      }
    }
  }

  private isPassable(x: number, y: number): boolean {
    if (x < 0 || x >= this.stageConfig.width || y < 0 || y >= this.stageConfig.height) return false;
    return !this.collisionMap[x][y];
  }
}
