import Phaser from 'phaser';
import { VIEWPORT_WIDTH } from '../config';

export class MusicScene extends Phaser.Scene {
  private btn!: Phaser.GameObjects.Text;
  private muted = false;

  constructor() {
    super({ key: 'MusicScene' });
  }

  create(): void {
    this.btn = this.add.text(VIEWPORT_WIDTH - 10, 10, '♫', {
      fontSize: '18px',
      color: '#ffd700',
      backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 },
    })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    this.btn.on('pointerdown', () => this.toggleMute());

    this.input.keyboard!.on('keydown-M', () => this.toggleMute());
  }

  private toggleMute(): void {
    this.muted = !this.muted;
    this.sound.mute = this.muted;
    this.btn.setText(this.muted ? '♫✕' : '♫');
    this.btn.setColor(this.muted ? '#666666' : '#ffd700');
  }
}
