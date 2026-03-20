import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';
import { QuizUI } from '../ui/QuizUI';
import { GalleryOverlay } from '../ui/GalleryOverlay';
import { EconomySystem } from '../systems/EconomySystem';
import type { ClassicalCharacter, TriviaQuestion } from '../data/types';
import type { PlayerState } from '../utils/SaveManager';
import { shuffleArray } from '../utils/RandomUtils';

export class BattleScene extends Phaser.Scene {
  private quizUI!: QuizUI;
  private economySystem = new EconomySystem();

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(data: { character: ClassicalCharacter; state: PlayerState; questionsRequired?: number }): void {
    const { character } = data;
    const questionsRequired = data.questionsRequired ?? 1;

    this.quizUI = new QuizUI(this);

    // Battle intro overlay
    const overlay = this.add.rectangle(
      VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2,
      VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x000000, 0.9
    );

    // Character type badge
    const typeBadge = character.type === 'author' ? '📚 AUTHOR' : '🎨 ARTIST';
    this.add.text(VIEWPORT_WIDTH / 2, 35, typeBadge, {
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Character portrait area (colored rectangle with icon for MVP)
    const portraitColor = character.type === 'author' ? 0x6b8cce : 0xce6b8c;
    const portrait = this.add.rectangle(VIEWPORT_WIDTH / 2, 90, 70, 70, portraitColor);
    portrait.setStrokeStyle(3, 0xffd700);

    const icon = this.add.text(VIEWPORT_WIDTH / 2, 90,
      character.type === 'author' ? '✎' : '🎨',
      { fontSize: '32px' }
    ).setOrigin(0.5);

    // Character name and info
    this.add.text(VIEWPORT_WIDTH / 2, 145, character.name, {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const years = `${character.birthYear < 0 ? Math.abs(character.birthYear) + ' BC' : character.birthYear} - ${character.deathYear < 0 ? Math.abs(character.deathYear) + ' BC' : character.deathYear}`;
    this.add.text(VIEWPORT_WIDTH / 2, 175, `${years} • ${character.nationality}`, {
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Bio
    const bioText = this.add.text(VIEWPORT_WIDTH / 2, 210, character.bio, {
      fontSize: '16px',
      color: '#cccccc',
      wordWrap: { width: VIEWPORT_WIDTH - 80 },
      align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5, 0);

    // Difficulty indicator - position below bio
    const diffColors = { easy: '#4aff4a', medium: '#ffaa00', hard: '#ff4a4a' };
    const diffY = bioText.y + bioText.height + 16;
    this.add.text(VIEWPORT_WIDTH / 2, diffY, `Difficulty: ${character.difficulty.toUpperCase()}`, {
      fontSize: '15px',
      color: diffColors[character.difficulty],
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Question count indicator
    const questionLabel = questionsRequired > 1
      ? `Answer ${questionsRequired} questions to capture this figure!`
      : 'Answer a question to capture this figure!';
    const readyText = this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 65, questionLabel, {
      fontSize: '16px',
      color: '#eee8d5',
    }).setOrigin(0.5);

    const startBtn = this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 30,
      '[ Begin Quiz ]', {
        fontSize: '20px',
        color: '#ffd700',
        fontStyle: 'bold',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on('pointerover', () => startBtn.setColor('#ffffff'));
    startBtn.on('pointerout', () => startBtn.setColor('#ffd700'));

    startBtn.on('pointerdown', () => {
      // Remove intro elements
      overlay.destroy();
      portrait.destroy();
      icon.destroy();
      readyText.destroy();
      startBtn.destroy();

      this.startQuiz(character, questionsRequired);
    });

    // Also allow space to start
    this.input.keyboard!.once('keydown-SPACE', () => {
      overlay.destroy();
      portrait.destroy();
      icon.destroy();
      readyText.destroy();
      startBtn.destroy();
      this.startQuiz(character, questionsRequired);
    });
  }

  private async startQuiz(character: ClassicalCharacter, questionsRequired: number): Promise<void> {
    // Pick distinct questions (shuffle and take first N)
    const shuffledQuestions = shuffleArray([...character.questions]);
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(questionsRequired, shuffledQuestions.length));

    let allCorrect = true;

    for (let i = 0; i < selectedQuestions.length; i++) {
      const question = selectedQuestions[i];

      // Show progress indicator for multi-question battles
      let progressText: Phaser.GameObjects.Text | null = null;
      if (selectedQuestions.length > 1) {
        progressText = this.add.text(VIEWPORT_WIDTH / 2, 30,
          `Question ${i + 1} of ${selectedQuestions.length}`, {
            fontSize: '14px',
            color: '#ffd700',
            fontStyle: 'bold',
            backgroundColor: '#00000099',
            padding: { x: 8, y: 4 },
          }).setOrigin(0.5).setDepth(400);
      }

      const result = await this.quizUI.show(question);

      if (progressText) progressText.destroy();

      if (!result.correct) {
        allCorrect = false;
        break;
      }

      // Show brief "Correct!" between questions (not after the last one)
      if (i < selectedQuestions.length - 1) {
        await this.showInterstitial(`Correct! Next question...`);
      }
    }

    const gold = allCorrect ? this.economySystem.getCaptureBounty(character.difficulty) : 0;

    // Show gallery of famous works after a correct answer
    if (allCorrect) {
      const gallery = new GalleryOverlay(this);
      await gallery.show(character);
    }

    // Return result to WorldScene
    const worldScene = this.scene.get('WorldScene');
    worldScene.events.emit('battle-result', {
      won: allCorrect,
      character,
      gold,
    });

    this.scene.stop();
  }

  private showInterstitial(message: string): Promise<void> {
    return new Promise((resolve) => {
      const bg = this.add.rectangle(
        VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2,
        VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x000000, 0.7
      ).setDepth(350);

      const text = this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2, message, {
        fontSize: '20px',
        color: '#4aff4a',
        fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(351);

      this.time.delayedCall(1000, () => {
        bg.destroy();
        text.destroy();
        resolve();
      });
    });
  }
}
