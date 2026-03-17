import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';
import { deleteSave } from '../utils/SaveManager';
import type { PlayerState } from '../utils/SaveManager';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { state: PlayerState }): void {
    const { state } = data;

    this.cameras.main.setBackgroundColor(0x0a0a1a);

    this.add.text(VIEWPORT_WIDTH / 2, 120, 'GAME OVER', {
      fontSize: '36px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(VIEWPORT_WIDTH / 2, 170, 'Your quest for knowledge has ended... for now.', {
      fontSize: '14px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Stats
    const statsY = 220;
    const stats = [
      `Characters captured: ${state.capturedCharacters.length} / 36`,
      `Battles won: ${state.stats.totalBattlesWon}`,
      `Battles lost: ${state.stats.totalBattlesLost}`,
      `Gold earned: ${state.stats.totalGoldEarned}`,
      `Items sold: ${state.stats.totalItemsSold}`,
      `Badges earned: ${state.badges.length}`,
    ];

    stats.forEach((stat, i) => {
      this.add.text(VIEWPORT_WIDTH / 2, statsY + i * 22, stat, {
        fontSize: '13px',
        color: '#eee8d5',
      }).setOrigin(0.5);
    });

    // Try again button
    const tryAgain = this.add.text(VIEWPORT_WIDTH / 2, 420, '[ Try Again ]', {
      fontSize: '18px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    tryAgain.on('pointerover', () => tryAgain.setColor('#ffffff'));
    tryAgain.on('pointerout', () => tryAgain.setColor('#ffd700'));
    tryAgain.on('pointerdown', () => {
      deleteSave();
      this.scene.start('TitleScene');
    });

    // Also space to restart
    this.input.keyboard!.once('keydown-SPACE', () => {
      deleteSave();
      this.scene.start('TitleScene');
    });
  }
}
