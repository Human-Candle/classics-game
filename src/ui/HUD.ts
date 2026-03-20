import Phaser from 'phaser';
import type { PlayerState } from '../utils/SaveManager';
import type { LevelConfig } from '../data/levels';
import type { StageMapConfig } from '../data/stages';

export class HUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private hearts: Phaser.GameObjects.Text[] = [];
  private goldText!: Phaser.GameObjects.Text;
  private capturedText!: Phaser.GameObjects.Text;
  private weaponText!: Phaser.GameObjects.Text;
  private stageText!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Graphics;
  private toastText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(100);
    this.container.setScrollFactor(0);
    this.build();
  }

  private build(): void {
    // Background bar - two rows
    const bg = this.scene.add.rectangle(400, 20, 800, 40, 0x000000, 0.7);
    this.container.add(bg);

    // Row 1 (y=6): Hearts | Gold | Weapon | Controls
    for (let i = 0; i < 8; i++) {
      const heart = this.scene.add.text(10 + i * 20, 5, '♥', {
        fontSize: '16px',
        color: '#e74c3c',
      });
      this.hearts.push(heart);
      this.container.add(heart);
    }

    this.goldText = this.scene.add.text(180, 6, '0 gold', {
      fontSize: '13px',
      color: '#ffd700',
      fontStyle: 'bold',
    });
    this.container.add(this.goldText);

    this.weaponText = this.scene.add.text(240, 6, 'No weapon', {
      fontSize: '11px',
      color: '#aaaaaa',
    });
    this.container.add(this.weaponText);

    const hint = this.scene.add.text(750, 6, '[I] [B]', {
      fontSize: '10px',
      color: '#555555',
    });
    this.container.add(hint);

    // Row 2 (y=23): Stage name (era) | Progress | Captured count
    this.stageText = this.scene.add.text(10, 24, '', {
      fontSize: '11px',
      color: '#aaaaaa',
    });
    this.container.add(this.stageText);

    this.progressBar = this.scene.add.graphics();
    this.container.add(this.progressBar);

    this.capturedText = this.scene.add.text(700, 24, '', {
      fontSize: '11px',
      color: '#eee8d5',
    });
    this.container.add(this.capturedText);

    // Toast notification area
    this.toastText = this.scene.add.text(400, 55, '', {
      fontSize: '14px',
      color: '#ffd700',
      backgroundColor: '#000000cc',
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setAlpha(0);
    this.container.add(this.toastText);
  }

  update(state: PlayerState, weaponName: string | null, levelConfig?: LevelConfig, stageConfig?: StageMapConfig): void {
    // Update hearts
    for (let i = 0; i < this.hearts.length; i++) {
      if (i < state.maxLives) {
        this.hearts[i].setVisible(true);
        this.hearts[i].setColor(i < state.lives ? '#e74c3c' : '#444444');
      } else {
        this.hearts[i].setVisible(false);
      }
    }

    this.goldText.setText(`${state.gold} gold`);
    this.weaponText.setText(weaponName ?? 'No weapon');
    this.weaponText.setColor(weaponName ? '#eee8d5' : '#666666');

    if (stageConfig && levelConfig) {
      this.stageText.setText(`${stageConfig.name}  (${stageConfig.eraRange})  —  Lv.${levelConfig.level} ${levelConfig.name}`);

      const captured = state.capturedCharacters.length;
      const target = levelConfig.capturesForNext;
      const stageProgress = captured - levelConfig.capturesRequired;
      const stageTotal = target - levelConfig.capturesRequired;
      this.capturedText.setText(`${stageProgress}/${stageTotal} captured`);

      // Draw progress bar next to captured text
      this.progressBar.clear();
      const barX = 620;
      const barY = 27;
      const barW = 70;
      const barH = 5;
      const progress = Math.min(stageProgress / Math.max(1, stageTotal), 1);

      this.progressBar.fillStyle(0x333333, 1);
      this.progressBar.fillRect(barX, barY, barW, barH);
      this.progressBar.fillStyle(0xc0a0ff, 1);
      this.progressBar.fillRect(barX, barY, barW * progress, barH);
    } else {
      this.capturedText.setText(`Captured: ${state.capturedCharacters.length}/40`);
    }
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
