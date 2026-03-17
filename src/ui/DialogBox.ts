import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';

export class DialogBox {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private textObj: Phaser.GameObjects.Text;
  private onClose?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(200);
    this.container.setScrollFactor(0);
    this.container.setVisible(false);

    const bg = scene.add.rectangle(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 60, VIEWPORT_WIDTH - 40, 100, 0x000000, 0.85);
    bg.setStrokeStyle(2, 0xffd700);
    this.container.add(bg);

    this.textObj = scene.add.text(30, VIEWPORT_HEIGHT - 100, '', {
      fontSize: '13px',
      color: '#eee8d5',
      wordWrap: { width: VIEWPORT_WIDTH - 80 },
      lineSpacing: 4,
    });
    this.container.add(this.textObj);

    const hint = scene.add.text(VIEWPORT_WIDTH - 30, VIEWPORT_HEIGHT - 20, '[SPACE]', {
      fontSize: '10px',
      color: '#888888',
    }).setOrigin(1, 1);
    this.container.add(hint);
  }

  show(text: string, onClose?: () => void): void {
    this.textObj.setText(text);
    this.container.setVisible(true);
    this.onClose = onClose;

    this.scene.input.keyboard!.once('keydown-SPACE', () => {
      this.hide();
    });
  }

  hide(): void {
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
