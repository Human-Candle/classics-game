import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';
import type { TriviaQuestion } from '../data/types';
import { shuffleArray } from '../utils/RandomUtils';

export interface QuizResult {
  correct: boolean;
  funFact: string;
}

export class QuizUI {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private answerButtons: Phaser.GameObjects.Container[] = [];
  private resolve?: (result: QuizResult) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(300);
    this.container.setScrollFactor(0);
    this.container.setVisible(false);
  }

  show(question: TriviaQuestion): Promise<QuizResult> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.container.removeAll(true);
      this.answerButtons = [];

      // Overlay background
      const overlay = this.scene.add.rectangle(
        VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2,
        VIEWPORT_WIDTH, VIEWPORT_HEIGHT,
        0x000000, 0.8
      );
      this.container.add(overlay);

      // Question text
      const qText = this.scene.add.text(VIEWPORT_WIDTH / 2, 160, question.question, {
        fontSize: '16px',
        color: '#eee8d5',
        wordWrap: { width: VIEWPORT_WIDTH - 100 },
        align: 'center',
        lineSpacing: 4,
      }).setOrigin(0.5);
      this.container.add(qText);

      // Shuffle answers while tracking correct index
      const indices = question.answers.map((_, i) => i);
      const shuffled = shuffleArray(indices);
      const correctShuffledIdx = shuffled.indexOf(question.correctIndex);

      // Answer buttons
      const startY = 260;
      shuffled.forEach((origIdx, displayIdx) => {
        const btn = this.createAnswerButton(
          VIEWPORT_WIDTH / 2,
          startY + displayIdx * 55,
          question.answers[origIdx],
          displayIdx === correctShuffledIdx,
          question.funFact
        );
        this.answerButtons.push(btn);
        this.container.add(btn);
      });

      this.container.setVisible(true);
    });
  }

  private createAnswerButton(
    x: number, y: number, text: string,
    isCorrect: boolean, funFact: string
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);

    const bg = this.scene.add.rectangle(0, 0, VIEWPORT_WIDTH - 120, 42, 0x2a2a4a);
    bg.setStrokeStyle(2, 0x4a4a7a);
    bg.setInteractive({ useHandCursor: true });

    const label = this.scene.add.text(0, 0, text, {
      fontSize: '13px',
      color: '#eee8d5',
      wordWrap: { width: VIEWPORT_WIDTH - 160 },
      align: 'center',
    }).setOrigin(0.5);

    container.add([bg, label]);

    bg.on('pointerover', () => bg.setStrokeStyle(2, 0xffd700));
    bg.on('pointerout', () => bg.setStrokeStyle(2, 0x4a4a7a));

    bg.on('pointerdown', () => {
      // Disable all buttons
      this.answerButtons.forEach(btn => {
        const btnBg = btn.getAt(0) as Phaser.GameObjects.Rectangle;
        btnBg.removeInteractive();
      });

      if (isCorrect) {
        bg.setFillStyle(0x2d6b3a);
        bg.setStrokeStyle(2, 0x4aff4a);
      } else {
        bg.setFillStyle(0x6b2d2d);
        bg.setStrokeStyle(2, 0xff4a4a);
        // Highlight correct answer
        this.answerButtons.forEach(b => {
          const bbg = b.getAt(0) as Phaser.GameObjects.Rectangle;
          // We stored isCorrect in the button's data
          if (b.getData('isCorrect')) {
            bbg.setFillStyle(0x2d6b3a);
            bbg.setStrokeStyle(2, 0x4aff4a);
          }
        });
      }

      // Show fun fact
      const factText = this.scene.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 80, `💡 ${funFact}`, {
        fontSize: '12px',
        color: '#ffd700',
        wordWrap: { width: VIEWPORT_WIDTH - 100 },
        align: 'center',
        backgroundColor: '#00000099',
        padding: { x: 8, y: 6 },
      }).setOrigin(0.5);
      this.container.add(factText);

      const continueText = this.scene.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 30, 'Click to continue...', {
        fontSize: '12px',
        color: '#888888',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      this.container.add(continueText);

      continueText.on('pointerdown', () => {
        this.container.setVisible(false);
        this.resolve?.({ correct: isCorrect, funFact });
      });

      // Also allow space to continue
      this.scene.input.keyboard!.once('keydown-SPACE', () => {
        this.container.setVisible(false);
        this.resolve?.({ correct: isCorrect, funFact });
      });
    });

    container.setData('isCorrect', isCorrect);
    return container;
  }

  hide(): void {
    this.container.setVisible(false);
  }

  destroy(): void {
    this.container.destroy();
  }
}
