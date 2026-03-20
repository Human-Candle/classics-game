import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30);

    const loadingText = this.add.text(width / 2, height / 2 - 40, 'Loading...', {
      fontSize: '16px',
      color: '#eee8d5',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffd700, 1);
      progressBar.fillRect(width / 2 - 155, height / 2 - 10, 310 * value, 20);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Audio
    this.load.audio('bg-music', 'assets/audio/Pixel Dunes.mp3');

    // Generate textures procedurally (no external assets needed for MVP)
    this.generateTextures();
  }

  create(): void {
    this.scene.start('TitleScene');
  }

  private generateTextures(): void {
    // We'll use Phaser graphics objects directly in scenes instead of pre-generated textures
    // This keeps the boot scene simple - all visual elements are created inline
  }
}
