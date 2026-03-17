import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, COLORS } from '../config';
import { drawHumanoid } from '../entities/CharacterSprite';

export class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.uiBg);

    // Large player character (4x scale)
    const parts = drawHumanoid(this, 'player', 4);
    const spriteContainer = this.add.container(VIEWPORT_WIDTH / 2, 160);
    spriteContainer.add(parts.body);
    spriteContainer.add(parts.leftArm);
    spriteContainer.add(parts.rightArm);
    spriteContainer.add(parts.leftLeg);
    spriteContainer.add(parts.rightLeg);

    // Character name
    this.add.text(VIEWPORT_WIDTH / 2, 250, 'HATTORI', {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(VIEWPORT_WIDTH / 2, 280, 'Legendary Time-Traveling Art Thief', {
      fontSize: '12px',
      color: '#e8c170',
    }).setOrigin(0.5);

    // Decorative line
    const line = this.add.graphics();
    line.lineStyle(2, 0xffd700, 0.4);
    line.lineBetween(VIEWPORT_WIDTH / 2 - 200, 300, VIEWPORT_WIDTH / 2 + 200, 300);

    // Narrative blurb
    const narrative = 'You are Hattori, the legendary time-traveling art thief. But your greed knows no bounds, and now the greats of old have been warned of your schemes. Only through the magic of learning can you defeat them, and capture them in your Urn of Knowledge to minister to you forever...';

    this.add.text(VIEWPORT_WIDTH / 2, 380, narrative, {
      fontSize: '14px',
      color: '#eee8d5',
      wordWrap: { width: 560 },
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5);

    // Begin button
    const beginBtn = this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 60,
      '[ Begin ]', {
        fontSize: '20px',
        color: '#ffd700',
        fontStyle: 'bold',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    beginBtn.on('pointerover', () => beginBtn.setColor('#ffffff'));
    beginBtn.on('pointerout', () => beginBtn.setColor('#ffd700'));
    beginBtn.on('pointerdown', () => {
      this.scene.start('WorldScene', { newGame: true });
    });

    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('WorldScene', { newGame: true });
    });

    // Controls hint
    this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 25, 'Press SPACE or click to begin', {
      fontSize: '11px',
      color: '#666666',
    }).setOrigin(0.5);
  }
}
