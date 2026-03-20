import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  canAfford: boolean;
  owned?: boolean;
  ownedLabel?: string;
}

export class ShopUI {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private onBuy?: (id: string) => void;
  private onClose?: () => void;
  private mode: 'buy' | 'sell' = 'buy';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(300);
    this.container.setScrollFactor(0);
    this.container.setVisible(false);
  }

  show(title: string, items: ShopItem[], gold: number, onBuy: (id: string) => void, onClose: () => void, mode: 'buy' | 'sell' = 'buy'): void {
    this.mode = mode;
    this.onBuy = onBuy;
    this.onClose = onClose;
    this.container.removeAll(true);

    // Overlay
    const overlay = this.scene.add.rectangle(
      VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2,
      VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x000000, 0.85
    );
    this.container.add(overlay);

    // Title
    const titleText = this.scene.add.text(VIEWPORT_WIDTH / 2, 40, title, {
      fontSize: '22px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.container.add(titleText);

    // Gold display
    const goldText = this.scene.add.text(VIEWPORT_WIDTH / 2, 70, `Gold: ${gold}`, {
      fontSize: '14px',
      color: '#ffd700',
    }).setOrigin(0.5);
    this.container.add(goldText);

    // Items
    const startY = 110;
    items.forEach((item, i) => {
      const y = startY + i * 70;
      this.createShopItemRow(item, y);
    });

    // Close button
    const closeBtn = this.scene.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 40, '[SPACE] Close', {
      fontSize: '14px',
      color: '#888888',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.close());
    this.container.add(closeBtn);

    this.scene.input.keyboard!.once('keydown-SPACE', () => this.close());
    this.container.setVisible(true);
  }

  private createShopItemRow(item: ShopItem, y: number): void {
    const bg = this.scene.add.rectangle(VIEWPORT_WIDTH / 2, y + 20, VIEWPORT_WIDTH - 80, 58, 0x1a1a3a);
    bg.setStrokeStyle(1, 0x3a3a5a);
    this.container.add(bg);

    const nameText = this.scene.add.text(60, y + 5, item.name, {
      fontSize: '14px',
      color: item.owned ? '#666666' : '#eee8d5',
      fontStyle: 'bold',
    });
    this.container.add(nameText);

    const descText = this.scene.add.text(60, y + 24, item.description, {
      fontSize: '11px',
      color: '#999999',
      wordWrap: { width: 450 },
    });
    this.container.add(descText);

    const priceText = this.scene.add.text(VIEWPORT_WIDTH - 140, y + 5, `${item.price} gold`, {
      fontSize: '14px',
      color: item.canAfford ? '#ffd700' : '#cc4444',
    });
    this.container.add(priceText);

    if (!item.owned) {
      const buyBtn = this.scene.add.rectangle(VIEWPORT_WIDTH - 80, y + 25, 60, 24,
        item.canAfford ? 0x2d6b3a : 0x444444);
      buyBtn.setStrokeStyle(1, item.canAfford ? 0x4aff4a : 0x666666);
      if (item.canAfford) {
        buyBtn.setInteractive({ useHandCursor: true });
        buyBtn.on('pointerdown', () => this.onBuy?.(item.id));
      }
      this.container.add(buyBtn);

      const buyLabel = this.scene.add.text(VIEWPORT_WIDTH - 80, y + 25,
        item.canAfford ? (this.mode === 'sell' ? 'SELL' : 'BUY') : '---', {
          fontSize: '11px',
          color: '#ffffff',
        }).setOrigin(0.5);
      this.container.add(buyLabel);
    } else {
      const ownedLabel = this.scene.add.text(VIEWPORT_WIDTH - 80, y + 25, item.ownedLabel ?? 'OWNED', {
        fontSize: '11px',
        color: '#666666',
      }).setOrigin(0.5);
      this.container.add(ownedLabel);
    }
  }

  close(): void {
    this.container.setVisible(false);
    this.onClose?.();
  }

  isVisible(): boolean {
    return this.container.visible;
  }

  destroy(): void {
    this.container.destroy();
  }
}
