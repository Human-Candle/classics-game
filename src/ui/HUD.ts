import Phaser from 'phaser';
import { COLORS } from '../config';
import type { PlayerState } from '../utils/SaveManager';

export class HUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private hearts: Phaser.GameObjects.Text[] = [];
  private goldText!: Phaser.GameObjects.Text;
  private capturedText!: Phaser.GameObjects.Text;
  private weaponText!: Phaser.GameObjects.Text;
  private toastText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(100);
    this.container.setScrollFactor(0);
    this.build();
  }

  private build(): void {
    // Background bar
    const bg = this.scene.add.rectangle(400, 16, 800, 32, 0x000000, 0.7);
    this.container.add(bg);

    // Hearts
    for (let i = 0; i < 8; i++) {
      const heart = this.scene.add.text(10 + i * 22, 5, '♥', {
        fontSize: '18px',
        color: '#e74c3c',
      });
      this.hearts.push(heart);
      this.container.add(heart);
    }

    // Gold
    this.goldText = this.scene.add.text(200, 8, '0g', {
      fontSize: '14px',
      color: '#ffd700',
      fontStyle: 'bold',
    });
    this.container.add(this.goldText);

    // Captured count
    this.capturedText = this.scene.add.text(300, 8, 'Captured: 0', {
      fontSize: '12px',
      color: '#eee8d5',
    });
    this.container.add(this.capturedText);

    // Weapon
    this.weaponText = this.scene.add.text(450, 8, 'No weapon', {
      fontSize: '12px',
      color: '#aaaaaa',
    });
    this.container.add(this.weaponText);

    // Controls hint
    const hint = this.scene.add.text(620, 8, '[I]nventory [B]adges', {
      fontSize: '10px',
      color: '#666666',
    });
    this.container.add(hint);

    // Toast notification area
    this.toastText = this.scene.add.text(400, 50, '', {
      fontSize: '14px',
      color: '#ffd700',
      backgroundColor: '#000000cc',
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setAlpha(0);
    this.container.add(this.toastText);
  }

  update(state: PlayerState, weaponName: string | null): void {
    // Update hearts
    for (let i = 0; i < this.hearts.length; i++) {
      if (i < state.maxLives) {
        this.hearts[i].setVisible(true);
        this.hearts[i].setColor(i < state.lives ? '#e74c3c' : '#444444');
      } else {
        this.hearts[i].setVisible(false);
      }
    }

    this.goldText.setText(`${state.gold}g`);
    this.capturedText.setText(`Captured: ${state.capturedCharacters.length}/36`);
    this.weaponText.setText(weaponName ?? 'No weapon');
    this.weaponText.setColor(weaponName ? '#eee8d5' : '#666666');
  }

  showToast(message: string, duration = 3000): void {
    this.toastText.setText(message);
    this.toastText.setAlpha(1);
    this.scene.tweens.add({
      targets: this.toastText,
      alpha: 0,
      delay: duration,
      duration: 500,
    });
  }

  destroy(): void {
    this.container.destroy();
  }
}
