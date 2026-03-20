import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';
import { badges } from '../data/badges';
import type { PlayerState } from '../utils/SaveManager';

export class BadgeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BadgeScene' });
  }

  create(data: { state: PlayerState }): void {
    const { state } = data;

    this.add.rectangle(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2,
      VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x0a0a1a, 0.95);

    this.add.text(VIEWPORT_WIDTH / 2, 25, 'BADGES', {
      fontSize: '22px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const earned = state.badges.length;
    this.add.text(VIEWPORT_WIDTH / 2, 50, `${earned} / ${badges.length} earned`, {
      fontSize: '12px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    const cols = 3;
    const startX = 50;
    const startY = 80;
    const cellW = 235;
    const cellH = 65;

    badges.forEach((badge, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * cellW;
      const y = startY + row * cellH;
      const unlocked = state.badges.includes(badge.id);

      const bg = this.add.rectangle(x + cellW / 2, y + cellH / 2, cellW - 8, cellH - 6,
        unlocked ? 0x2a3a2a : 0x1a1a1a);
      bg.setStrokeStyle(1, unlocked ? 0xffd700 : 0x333333);

      const icon = this.add.text(x + 15, y + cellH / 2, unlocked ? '🏆' : '🔒', {
        fontSize: '18px',
      }).setOrigin(0, 0.5);

      const name = this.add.text(x + 40, y + 15, badge.name, {
        fontSize: '12px',
        color: unlocked ? '#ffd700' : '#555555',
        fontStyle: 'bold',
      });

      const desc = this.add.text(x + 40, y + 33, badge.description, {
        fontSize: '10px',
        color: unlocked ? '#aaaaaa' : '#333333',
        wordWrap: { width: cellW - 55 },
      });
    });

    this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 20, '[SPACE] or [B] Close', {
      fontSize: '12px',
      color: '#666666',
    }).setOrigin(0.5);

    const closeHandler = () => {
      this.scene.stop();
      this.scene.resume('WorldScene');
      const world = this.scene.get('WorldScene');
      world.events.emit('shop-closed');
    };

    this.input.keyboard!.on('keydown-SPACE', closeHandler);
    this.input.keyboard!.on('keydown-B', closeHandler);
  }
}
