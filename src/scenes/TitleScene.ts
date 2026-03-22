import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, COLORS } from '../config';
import { hasSave } from '../utils/SaveManager';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    // Start background music and persistent mute button (both persist across scenes)
    if (!this.scene.isActive('MusicScene')) {
      this.scene.launch('MusicScene');
    }
    // Browsers block autoplay until user interaction — resume AudioContext on first click
    const startMusic = () => {
      if (this.sound.locked) {
        this.sound.once('unlocked', () => {
          if (!this.sound.get('bg-music')?.isPlaying) {
            this.sound.play('bg-music', { loop: true, volume: 0.24 });
          }
        });
      } else if (!this.sound.get('bg-music')?.isPlaying) {
        this.sound.play('bg-music', { loop: true, volume: 0.24 });
      }
    };
    startMusic();

    const cx = VIEWPORT_WIDTH / 2;
    const cy = VIEWPORT_HEIGHT / 2;

    // Background
    this.cameras.main.setBackgroundColor(COLORS.uiBg);

    // Title
    this.add.text(cx, cy - 140, 'THE CLASSIC EDUCATION', {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cx, cy - 105, 'YOU NEVER GOT', {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(cx, cy - 65, 'Capture the greatest minds in history', {
      fontSize: '14px',
      color: '#eee8d5',
    }).setOrigin(0.5);

    // Decorative line
    const line = this.add.graphics();
    line.lineStyle(2, 0xffd700, 0.5);
    line.lineBetween(cx - 150, cy - 45, cx + 150, cy - 45);

    // New Game button
    const newGameBtn = this.createButton(cx, cy + 10, 'NEW GAME', () => {
      this.scene.start('IntroScene');
    });

    // Continue button (only if save exists)
    if (hasSave()) {
      this.createButton(cx, cy + 60, 'CONTINUE', () => {
        this.scene.start('WorldScene', { newGame: false });
      });
    }

    // Controls info
    this.add.text(cx, cy + 140, 'Arrow Keys / WASD to move', {
      fontSize: '11px',
      color: '#888888',
    }).setOrigin(0.5);
    this.add.text(cx, cy + 158, '[E] to interact  •  [I] for inventory  •  [B] for badges', {
      fontSize: '11px',
      color: '#888888',
    }).setOrigin(0.5);

    // Version
    this.add.text(cx, VIEWPORT_HEIGHT - 20, 'v0.1 MVP', {
      fontSize: '10px',
      color: '#444444',
    }).setOrigin(0.5);
  }

  private createButton(x: number, y: number, text: string, onClick: () => void): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 200, 36, 0x333355);
    bg.setStrokeStyle(2, 0xffd700);
    bg.setInteractive({ useHandCursor: true });

    const label = this.add.text(0, 0, text, {
      fontSize: '16px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add([bg, label]);

    bg.on('pointerover', () => {
      bg.setFillStyle(0x444477);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x333355);
    });
    bg.on('pointerdown', onClick);

    return container;
  }
}
