import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';
import { items as allItems } from '../data/items';
import { WikimediaService } from '../utils/WikimediaService';
import type { PlayerState } from '../utils/SaveManager';
import type { ClassicalCharacter, GameItem } from '../data/types';

export class InventoryScene extends Phaser.Scene {
  private characters: ClassicalCharacter[] = [];
  private detailContainer: Phaser.GameObjects.Container | null = null;
  private detailEscHandler: (() => void) | null = null;

  constructor() {
    super({ key: 'InventoryScene' });
  }

  create(data: { state: PlayerState; characters: ClassicalCharacter[] }): void {
    const { state, characters } = data;
    this.characters = characters;

    // Background
    const bg = this.add.rectangle(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2,
      VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x0a0a1a, 0.95);

    // Title
    this.add.text(VIEWPORT_WIDTH / 2, 25, 'COLLECTION', {
      fontSize: '22px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Tab buttons
    let currentTab = 'characters';
    const charTab = this.createTab(150, 55, 'Characters', true);
    const itemTab = this.createTab(350, 55, 'Items', false);
    const contentContainer = this.add.container(0, 0);

    const showCharacters = () => {
      contentContainer.removeAll(true);
      this.renderCharacterGrid(contentContainer, state, characters);
    };

    const showItems = () => {
      contentContainer.removeAll(true);
      this.renderItemList(contentContainer, state);
    };

    charTab.bg.on('pointerdown', () => {
      currentTab = 'characters';
      charTab.bg.setFillStyle(0x333366);
      itemTab.bg.setFillStyle(0x1a1a3a);
      showCharacters();
    });
    itemTab.bg.on('pointerdown', () => {
      currentTab = 'items';
      itemTab.bg.setFillStyle(0x333366);
      charTab.bg.setFillStyle(0x1a1a3a);
      showItems();
    });

    showCharacters();

    // Close
    this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 20, '[ESC] or [I] Close', {
      fontSize: '12px',
      color: '#666666',
    }).setOrigin(0.5);

    const closeHandler = () => {
      this.scene.stop();
      this.scene.resume('WorldScene');
      const world = this.scene.get('WorldScene');
      world.events.emit('shop-closed'); // reuse to unlock input
    };

    this.input.keyboard!.on('keydown-ESC', closeHandler);
    this.input.keyboard!.on('keydown-I', closeHandler);
  }

  private createTab(x: number, y: number, label: string, active: boolean) {
    const bg = this.add.rectangle(x, y, 140, 28, active ? 0x333366 : 0x1a1a3a);
    bg.setStrokeStyle(1, 0x4a4a7a);
    bg.setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, {
      fontSize: '12px',
      color: '#eee8d5',
    }).setOrigin(0.5);
    return { bg, text };
  }

  private renderCharacterGrid(container: Phaser.GameObjects.Container, state: PlayerState, characters: ClassicalCharacter[]): void {
    const cols = 6;
    const startX = 60;
    const startY = 90;
    const cellW = 115;
    const cellH = 55;

    characters.forEach((char, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * cellW;
      const y = startY + row * cellH;
      const captured = state.capturedCharacters.includes(char.id);

      const cell = this.add.rectangle(x + cellW / 2, y + cellH / 2, cellW - 6, cellH - 4,
        captured ? (char.type === 'author' ? 0x2a3a5a : 0x5a2a3a) : 0x1a1a1a
      );
      cell.setStrokeStyle(1, captured ? 0x4a6a9a : 0x333333);
      container.add(cell);

      if (captured) {
        const name = this.add.text(x + cellW / 2, y + 14, char.name, {
          fontSize: '11px',
          color: '#eee8d5',
          align: 'center',
        }).setOrigin(0.5);
        container.add(name);

        const years = `${char.birthYear < 0 ? Math.abs(char.birthYear) + ' BC' : char.birthYear}-${char.deathYear}`;
        const info = this.add.text(x + cellW / 2, y + 30, `${years} • ${char.nationality}`, {
          fontSize: '10px',
          color: '#888888',
        }).setOrigin(0.5);
        container.add(info);

        const icon = this.add.text(x + cellW / 2, y + 45,
          char.type === 'author' ? '📚' : '🎨', { fontSize: '11px' }).setOrigin(0.5);
        container.add(icon);
      } else {
        const q = this.add.text(x + cellW / 2, y + cellH / 2, '?', {
          fontSize: '18px',
          color: '#333333',
        }).setOrigin(0.5);
        container.add(q);
      }
    });
  }

  private renderItemList(container: Phaser.GameObjects.Container, state: PlayerState): void {
    if (state.inventory.length === 0) {
      const empty = this.add.text(VIEWPORT_WIDTH / 2, 200, 'No items yet. Try looting some locations!', {
        fontSize: '14px',
        color: '#666666',
      }).setOrigin(0.5);
      container.add(empty);
      return;
    }

    let y = 85;
    for (const slot of state.inventory) {
      const item = allItems.find(i => i.id === slot.itemId);
      if (!item) continue;

      const rarityColors: Record<string, string> = {
        common: '#aaaaaa', uncommon: '#4aff4a', rare: '#4a8aff', legendary: '#ffd700',
      };

      const row = this.add.rectangle(VIEWPORT_WIDTH / 2, y + 15, VIEWPORT_WIDTH - 60, 32, 0x1a1a3a);
      row.setStrokeStyle(1, 0x2a2a4a);
      row.setInteractive({ useHandCursor: true });
      row.on('pointerover', () => row.setStrokeStyle(1, 0x6a6a9a));
      row.on('pointerout', () => row.setStrokeStyle(1, 0x2a2a4a));
      row.on('pointerdown', () => this.showItemDetail(item));
      container.add(row);

      const icon = this.add.text(50, y + 8, item.type === 'book' ? '📖' : '🖼️', {
        fontSize: '14px',
      });
      container.add(icon);

      const name = this.add.text(75, y + 6, `${item.name} x${slot.quantity}`, {
        fontSize: '11px',
        color: rarityColors[item.rarity] || '#eee8d5',
      });
      container.add(name);

      const value = this.add.text(VIEWPORT_WIDTH - 60, y + 8, `~${item.baseValue}g`, {
        fontSize: '10px',
        color: '#ffd700',
      }).setOrigin(1, 0);
      container.add(value);

      y += 34;
    }
  }

  private showItemDetail(item: GameItem): void {
    // Close existing detail if open
    this.closeDetail();

    const container = this.add.container(0, 0);
    container.setDepth(500);
    this.detailContainer = container;

    // Overlay
    const overlay = this.add.rectangle(
      VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2,
      VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x000000, 0.88
    );
    overlay.setInteractive(); // blocks clicks to items behind
    container.add(overlay);

    const creator = this.characters.find(c => c.id === item.creatorId || c.id.includes(item.creatorId));
    const rarityColors: Record<string, string> = {
      common: '#aaaaaa', uncommon: '#4aff4a', rare: '#4a8aff', legendary: '#ffd700',
    };

    // Item name
    container.add(this.add.text(VIEWPORT_WIDTH / 2, 100, item.name, {
      fontSize: '22px',
      color: '#ffd700',
      fontStyle: 'bold',
      wordWrap: { width: VIEWPORT_WIDTH - 120 },
      align: 'center',
    }).setOrigin(0.5));

    // Year and rarity
    container.add(this.add.text(VIEWPORT_WIDTH / 2, 130, `${item.year < 0 ? Math.abs(item.year) + ' BC' : item.year} • ${item.rarity.toUpperCase()}`, {
      fontSize: '12px',
      color: rarityColors[item.rarity] || '#aaaaaa',
    }).setOrigin(0.5));

    // Creator info
    if (creator) {
      container.add(this.add.text(VIEWPORT_WIDTH / 2, 155, `by ${creator.name} (${creator.nationality})`, {
        fontSize: '13px',
        color: '#cccccc',
      }).setOrigin(0.5));
    }

    // Description
    container.add(this.add.text(VIEWPORT_WIDTH / 2, 190, item.description, {
      fontSize: '12px',
      color: '#aaaaaa',
      wordWrap: { width: VIEWPORT_WIDTH - 160 },
      align: 'center',
      lineSpacing: 3,
    }).setOrigin(0.5));

    // Image area for artworks
    if (item.type === 'artwork') {
      const loadingText = this.add.text(VIEWPORT_WIDTH / 2, 320, 'Loading image...', {
        fontSize: '11px',
        color: '#666666',
      }).setOrigin(0.5);
      container.add(loadingText);

      this.loadItemImage(item, creator?.name, container, loadingText);
    } else {
      // Book — large icon
      container.add(this.add.text(VIEWPORT_WIDTH / 2, 330, '📖', {
        fontSize: '64px',
      }).setOrigin(0.5));
    }

    // Value
    container.add(this.add.text(VIEWPORT_WIDTH / 2, 440, `Estimated value: ~${item.baseValue}g`, {
      fontSize: '12px',
      color: '#ffd700',
    }).setOrigin(0.5));

    // Close button
    const closeBtn = this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 35, '[ESC] Close', {
      fontSize: '14px',
      color: '#888888',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.closeDetail());
    container.add(closeBtn);

    // ESC to close detail (not the whole inventory)
    this.detailEscHandler = () => this.closeDetail();
    this.input.keyboard!.once('keydown-ESC', this.detailEscHandler);
  }

  private async loadItemImage(
    item: GameItem, creatorName: string | undefined,
    container: Phaser.GameObjects.Container, loadingText: Phaser.GameObjects.Text
  ): Promise<void> {
    const imageUrl = await WikimediaService.getImageUrl(item.name, creatorName);
    if (!imageUrl || !container.active) return;

    const key = `item-${item.id}`;
    const loaded = await WikimediaService.loadImageIntoPhaser(this, key, imageUrl);

    if (loaded && container.active) {
      loadingText.setVisible(false);
      const image = this.add.image(VIEWPORT_WIDTH / 2, 320, key);
      const maxWidth = 240;
      const maxHeight = 150;
      const scaleX = maxWidth / image.width;
      const scaleY = maxHeight / image.height;
      image.setScale(Math.min(scaleX, scaleY, 1));
      container.add(image);
    } else if (container.active) {
      loadingText.setText('Image not found');
    }
  }

  private closeDetail(): void {
    if (this.detailContainer) {
      this.detailContainer.destroy();
      this.detailContainer = null;
    }
    if (this.detailEscHandler) {
      this.input.keyboard!.off('keydown-ESC', this.detailEscHandler);
      this.detailEscHandler = null;
    }
  }
}
