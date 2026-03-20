import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';
import { deleteSave } from '../utils/SaveManager';
import type { PlayerState } from '../utils/SaveManager';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  create(data: { state: PlayerState }): void {
    const { state } = data;

    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // Confetti particles (simple colored rectangles floating down)
    for (let i = 0; i < 30; i++) {
      const confettiColors = [0xffd700, 0xe74c3c, 0x4aff4a, 0x4a8aff, 0xce6b8c, 0x6b8cce];
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      const x = Math.random() * VIEWPORT_WIDTH;
      const y = -20 - Math.random() * 200;
      const size = 4 + Math.random() * 6;
      const confetti = this.add.rectangle(x, y, size, size, color);
      confetti.setAngle(Math.random() * 360);

      this.tweens.add({
        targets: confetti,
        y: VIEWPORT_HEIGHT + 50,
        x: x + (Math.random() - 0.5) * 200,
        angle: confetti.angle + (Math.random() - 0.5) * 720,
        duration: 3000 + Math.random() * 4000,
        delay: Math.random() * 2000,
        repeat: -1,
        ease: 'Sine.easeIn',
      });
    }

    // Title
    this.add.text(VIEWPORT_WIDTH / 2, 80, 'VICTORY!', {
      fontSize: '48px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Glow effect (pulsing shadow text behind)
    const glow = this.add.text(VIEWPORT_WIDTH / 2, 80, 'VICTORY!', {
      fontSize: '48px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.3);

    this.tweens.add({
      targets: glow,
      alpha: 0.1,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Flavor text
    this.add.text(VIEWPORT_WIDTH / 2, 140,
      'Hattori\'s Urn of Knowledge is complete.\nThe greatest minds of history now serve at your command.', {
        fontSize: '14px',
        color: '#eee8d5',
        align: 'center',
        lineSpacing: 4,
      }).setOrigin(0.5);

    // Stats
    const statsY = 200;
    const stats = [
      `All 40 characters captured!`,
      `Battles won: ${state.stats.totalBattlesWon}`,
      `Battles lost: ${state.stats.totalBattlesLost}`,
      `Gold earned: ${state.stats.totalGoldEarned}`,
      `Items sold: ${state.stats.totalItemsSold}`,
      `Badges earned: ${state.badges.length}`,
    ];

    stats.forEach((stat, i) => {
      this.add.text(VIEWPORT_WIDTH / 2, statsY + i * 24, stat, {
        fontSize: '13px',
        color: i === 0 ? '#ffd700' : '#eee8d5',
        fontStyle: i === 0 ? 'bold' : 'normal',
      }).setOrigin(0.5);
    });

    // Play Again button
    const playAgain = this.add.text(VIEWPORT_WIDTH / 2, 420, '[ Play Again ]', {
      fontSize: '18px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playAgain.on('pointerover', () => playAgain.setColor('#ffffff'));
    playAgain.on('pointerout', () => playAgain.setColor('#ffd700'));
    playAgain.on('pointerdown', () => {
      deleteSave();
      this.scene.start('TitleScene');
    });

    this.input.keyboard!.once('keydown-SPACE', () => {
      deleteSave();
      this.scene.start('TitleScene');
    });
  }
}
