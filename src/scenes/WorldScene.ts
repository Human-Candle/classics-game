import Phaser from 'phaser';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, COLORS } from '../config';
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
import { PlayerState, createDefaultState, saveGame, loadGame } from '../utils/SaveManager';
import { locations } from '../data/locations';
import { getWeaponById, weapons } from '../data/weapons';
import { authors } from '../data/authors';
import { artists } from '../data/artists';
import type { ClassicalCharacter, GameItem } from '../data/types';

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
  private pendingLoot: { items: { item: GameItem; quantity: number }[]; locationId: string } | null = null;

  constructor() {
    super({ key: 'WorldScene' });
  }

  init(data: { newGame: boolean }): void {
    if (data.newGame) {
      this.state = createDefaultState();
    } else {
      this.state = loadGame() ?? createDefaultState();
    }
  }

  create(): void {
    this.allCharacters = [...authors, ...artists];

    // Initialize systems
    this.encounterSystem = new EncounterSystem(this.allCharacters, this.state.capturedCharacters);
    this.lootSystem = new LootSystem();
    this.economySystem = new EconomySystem();
    this.healthSystem = new HealthSystem();
    this.progressionSystem = new ProgressionSystem(this.allCharacters);

    // Build the map
    this.buildMap();

    // Create player
    this.player = new Player(this, this.state.position.x, this.state.position.y);

    // Create location entities
    this.createLocations();

    // Create shop zones
    this.createShopZones();

    // Spawn some visible characters
    this.spawnCharactersOnMap();

    // Fog of war
    this.fog = new FogOfWar(this, this.state.revealedTiles);
    this.fog.reveal(this.player.tileX, this.player.tileY);

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);

    // HUD
    this.hud = new HUD(this);
    this.dialog = new DialogBox(this);
    this.minimap = new Minimap(this);
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

    // Listen for return from battle
    this.events.on('battle-result', this.handleBattleResult, this);
    this.events.on('shop-closed', () => { this.inputLocked = false; });
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
    this.state.revealedTiles = this.fog.revealedTiles;

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

    // Check random encounter
    const encounter = this.encounterSystem.checkEncounter(
      this.player.stepCount, this.player.tileX, this.player.tileY
    );
    if (encounter) {
      this.dialog.show(
        `You've been ambushed by ${encounter.name}!`,
        () => this.startBattle(encounter)
      );
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
    this.scene.launch('BattleScene', {
      character,
      state: this.state,
    });
    this.scene.pause();
  }

  private handleBattleResult(result: { won: boolean; character: ClassicalCharacter; gold: number }): void {
    this.inputLocked = false;
    this.scene.resume();

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

      this.hud.showToast(`Captured ${result.character.name}! +${result.gold}g`);

      // Check victory
      if (this.state.capturedCharacters.length >= 36) {
        saveGame(this.state);
        this.scene.start('VictoryScene', { state: this.state });
        return;
      }

      // Check badges
      const newBadges = this.progressionSystem.checkNewBadges(this.state);
      for (const badge of newBadges) {
        this.state.badges.push(badge.id);
        this.hud.showToast(`🏆 Badge: ${badge.name} - ${badge.description}`);
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
        const lootNames = this.pendingLoot.items.map(l => l.item.name).join(', ');
        this.hud.showToast(`Recovered loot: ${lootNames}`);
      } else {
        this.hud.showToast('The guardian kept the loot!');
      }
      this.pendingLoot = null;
    }

    this.updateHUD();
    saveGame(this.state);
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
  }

  private interactWithLocation(loc: LocationEntity): void {
    const now = Date.now();
    if (loc.isOnCooldown(now)) {
      this.dialog.show('This location is still recovering from your last visit...');
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

    loc.lastLootTime = now;

    // Check for guardian encounter BEFORE giving loot
    if (result.triggeredEncounter) {
      const guardian = this.encounterSystem.getRandomCharacter();
      if (guardian) {
        // Store loot as pending — only awarded if player wins
        this.pendingLoot = { items: result.items, locationId: loc.locationData.id };
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

    const itemNames = result.items.map(l => l.item.name).join(', ');
    this.hud.showToast(`Looted: ${itemNames || 'nothing of value'}`);

    // Check badges
    const newBadges = this.progressionSystem.checkNewBadges(this.state);
    for (const badge of newBadges) {
      this.state.badges.push(badge.id);
      this.hud.showToast(`🏆 Badge: ${badge.name}`);
    }

    this.updateHUD();
    saveGame(this.state);
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
  }

  private updateMinimap(): void {
    this.minimap.update(
      this.player.tileX,
      this.player.tileY,
      this.state.revealedTiles,
      this.collisionMap,
      this.characterEntities,
      this.locationEntities
    );
  }

  private updateHUD(): void {
    const weaponName = this.state.equippedWeapon
      ? (getWeaponById(this.state.equippedWeapon)?.name ?? null)
      : null;
    this.hud.update(this.state, weaponName);
  }

  // === MAP GENERATION ===

  private buildMap(): void {
    this.collisionMap = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      this.collisionMap[x] = [];
      for (let y = 0; y < MAP_HEIGHT; y++) {
        this.collisionMap[x][y] = false;
      }
    }

    const graphics = this.add.graphics();

    // Draw ground tiles
    for (let x = 0; x < MAP_WIDTH; x++) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
        // Grass with variation
        const isAlt = (x + y) % 7 === 0 || (x * 3 + y * 5) % 11 === 0;
        const color = isAlt ? COLORS.grassAlt : COLORS.grass;
        graphics.fillStyle(color, 1);
        graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        // Map border = water (collision)
        if (x <= 1 || x >= MAP_WIDTH - 2 || y <= 1 || y >= MAP_HEIGHT - 2) {
          graphics.fillStyle(COLORS.water, 1);
          graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          this.collisionMap[x][y] = true;
        }
      }
    }

    // Draw paths between key locations
    this.drawPath(graphics, 10, 10, 12, 8);   // spawn to library of alexandria
    this.drawPath(graphics, 12, 8, 25, 15);   // to monte cassino
    this.drawPath(graphics, 25, 15, 40, 20);  // to medici
    this.drawPath(graphics, 40, 20, 55, 12);  // to bodleian
    this.drawPath(graphics, 40, 20, 35, 42);  // to uffizi
    this.drawPath(graphics, 55, 12, 60, 35);  // to louvre
    this.drawPath(graphics, 60, 35, 68, 48);  // to guggenheim
    this.drawPath(graphics, 35, 42, 60, 35);  // uffizi to louvre

    // Path to shops (near spawn)
    this.drawPath(graphics, 10, 10, 5, 18);
    this.drawPath(graphics, 5, 18, 15, 18);

    // Water features (lakes/ponds)
    this.drawWater(graphics, 20, 30, 4, 3);
    this.drawWater(graphics, 50, 25, 3, 2);
    this.drawWater(graphics, 45, 50, 5, 3);

    // Trees/forests (collision decorations)
    this.drawForest(graphics, 15, 25, 6, 5);
    this.drawForest(graphics, 30, 8, 4, 4);
    this.drawForest(graphics, 48, 38, 5, 6);
    this.drawForest(graphics, 70, 15, 5, 4);
    this.drawForest(graphics, 8, 40, 4, 5);

    graphics.setDepth(0);
  }

  private drawPath(graphics: Phaser.GameObjects.Graphics, x1: number, y1: number, x2: number, y2: number): void {
    // Simple L-shaped path
    const midX = x2;
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      for (let w = -1; w <= 1; w++) {
        const py = y1 + w;
        if (py >= 0 && py < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
          graphics.fillStyle(COLORS.path, 1);
          graphics.fillRect(x * TILE_SIZE, py * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          this.collisionMap[x][py] = false;
        }
      }
    }
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      for (let w = -1; w <= 1; w++) {
        const px = midX + w;
        if (px >= 0 && px < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
          graphics.fillStyle(COLORS.path, 1);
          graphics.fillRect(px * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          this.collisionMap[px][y] = false;
        }
      }
    }
  }

  private drawWater(graphics: Phaser.GameObjects.Graphics, cx: number, cy: number, w: number, h: number): void {
    for (let x = cx - w; x <= cx + w; x++) {
      for (let y = cy - h; y <= cy + h; y++) {
        if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
          const dist = ((x - cx) / w) ** 2 + ((y - cy) / h) ** 2;
          if (dist <= 1) {
            graphics.fillStyle(COLORS.water, 1);
            graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            this.collisionMap[x][y] = true;
          }
        }
      }
    }
  }

  private drawForest(graphics: Phaser.GameObjects.Graphics, cx: number, cy: number, w: number, h: number): void {
    for (let x = cx; x < cx + w; x++) {
      for (let y = cy; y < cy + h; y++) {
        if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
          // Sparse trees
          if ((x * 7 + y * 13) % 3 !== 0) {
            graphics.fillStyle(0x2d5a1e, 1);
            graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            // Tree top (circle)
            graphics.fillStyle(0x1a4010, 1);
            graphics.fillCircle(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 3, 12);
            this.collisionMap[x][y] = true;
          }
        }
      }
    }
  }

  private createLocations(): void {
    for (const loc of locations) {
      // Mark building tiles as collision
      for (let dx = 0; dx < 2; dx++) {
        for (let dy = 0; dy < 2; dy++) {
          const bx = loc.position.x + dx;
          const by = loc.position.y + dy;
          if (bx < MAP_WIDTH && by < MAP_HEIGHT) {
            this.collisionMap[bx][by] = true;
          }
        }
      }

      const entity = new LocationEntity(this, loc);
      this.locationEntities.push(entity);
      entity.setVisible(false);
    }
  }

  private createShopZones(): void {
    // Shops are placed near the starting area
    this.shopZones = [
      { x: 5, y: 18, type: 'blackmarket', name: 'The Black Market' },
      { x: 10, y: 18, type: 'apothecary', name: 'The Apothecary' },
      { x: 15, y: 18, type: 'blacksmith', name: 'The Blacksmith' },
    ];

    const graphics = this.add.graphics();
    graphics.setDepth(3);

    for (const shop of this.shopZones) {
      // Draw shop building
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

  private spawnCharactersOnMap(): void {
    // Place some uncaptured characters on the map
    const uncaptured = this.allCharacters.filter(
      c => !this.state.capturedCharacters.includes(c.id)
    );

    // Spawn up to 8 visible characters
    const toSpawn = uncaptured.slice(0, 8);
    const usedPositions = new Set<string>();

    for (const char of toSpawn) {
      let tx: number, ty: number;
      let attempts = 0;

      // Place by difficulty zone
      do {
        if (char.difficulty === 'easy') {
          tx = 5 + Math.floor(Math.random() * 20);
          ty = 5 + Math.floor(Math.random() * 15);
        } else if (char.difficulty === 'medium') {
          tx = 20 + Math.floor(Math.random() * 25);
          ty = 10 + Math.floor(Math.random() * 25);
        } else {
          tx = 40 + Math.floor(Math.random() * 30);
          ty = 20 + Math.floor(Math.random() * 30);
        }
        attempts++;
      } while (
        (this.collisionMap[tx]?.[ty] || usedPositions.has(`${tx},${ty}`)) &&
        attempts < 50
      );

      if (attempts < 50) {
        usedPositions.add(`${tx},${ty}`);
        const entity = new CharacterEntity(this, tx, ty, char);
        entity.setVisible(this.fog?.isTileRevealed(tx, ty) ?? false);
        this.characterEntities.push(entity);
      }
    }
  }

  private isPassable(x: number, y: number): boolean {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
    return !this.collisionMap[x][y];
  }
}
