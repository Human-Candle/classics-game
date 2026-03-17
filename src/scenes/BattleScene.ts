import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';
import { QuizUI } from '../ui/QuizUI';
import { GalleryOverlay } from '../ui/GalleryOverlay';
import { EconomySystem } from '../systems/EconomySystem';
import type { ClassicalCharacter } from '../data/types';
import type { PlayerState } from '../utils/SaveManager';

export class BattleScene extends Phaser.Scene {
  private quizUI!: QuizUI;
  private economySystem = new EconomySystem();

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(data: { character: ClassicalCharacter; state: PlayerState }): void {
    const { character } = data;

    this.quizUI = new QuizUI(this);

    // Battle intro overlay
    const overlay = this.add.rectangle(
      VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2,
      VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x000000, 0.9
    );

    // Character type badge
    const typeBadge = character.type === 'author' ? '📚 AUTHOR' : '🎨 ARTIST';
    this.add.text(VIEWPORT_WIDTH / 2, 40, typeBadge, {
      fontSize: '12px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Character portrait area (colored rectangle with icon for MVP)
    const portraitColor = character.type === 'author' ? 0x6b8cce : 0xce6b8c;
    const portrait = this.add.rectangle(VIEWPORT_WIDTH / 2, 90, 60, 60, portraitColor);
    portrait.setStrokeStyle(3, 0xffd700);

    const icon = this.add.text(VIEWPORT_WIDTH / 2, 90,
      character.type === 'author' ? '✎' : '🎨',
      { fontSize: '28px' }
    ).setOrigin(0.5);

    // Character name and info
    this.add.text(VIEWPORT_WIDTH / 2, 135, character.name, {
      fontSize: '22px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const years = `${character.birthYear < 0 ? Math.abs(character.birthYear) + ' BC' : character.birthYear} - ${character.deathYear < 0 ? Math.abs(character.deathYear) + ' BC' : character.deathYear}`;
    this.add.text(VIEWPORT_WIDTH / 2, 158, `${years} • ${character.nationality}`, {
      fontSize: '12px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Bio
    this.add.text(VIEWPORT_WIDTH / 2, 180, character.bio, {
      fontSize: '11px',
      color: '#cccccc',
      wordWrap: { width: VIEWPORT_WIDTH - 100 },
      align: 'center',
    }).setOrigin(0.5);

    // Difficulty indicator
    const diffColors = { easy: '#4aff4a', medium: '#ffaa00', hard: '#ff4a4a' };
    this.add.text(VIEWPORT_WIDTH / 2, 205, `Difficulty: ${character.difficulty.toUpperCase()}`, {
      fontSize: '11px',
      color: diffColors[character.difficulty],
    }).setOrigin(0.5);

    // "Ready?" prompt
    const readyText = this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 60,
      'Answer a question to capture this figure!', {
        fontSize: '13px',
        color: '#eee8d5',
      }).setOrigin(0.5);

    const startBtn = this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 30,
      '[ Begin Quiz ]', {
        fontSize: '16px',
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

      this.startQuiz(character);
    });

    // Also allow space to start
    this.input.keyboard!.once('keydown-SPACE', () => {
      overlay.destroy();
      portrait.destroy();
      icon.destroy();
      readyText.destroy();
      startBtn.destroy();
      this.startQuiz(character);
    });
  }

  private async startQuiz(character: ClassicalCharacter): Promise<void> {
    // Pick a random question
    const question = character.questions[
      Math.floor(Math.random() * character.questions.length)
    ];

    const result = await this.quizUI.show(question);
    const gold = result.correct ? this.economySystem.getCaptureBounty(character.difficulty) : 0;

    // Show gallery of famous works after a correct answer
    if (result.correct) {
      const gallery = new GalleryOverlay(this);
      await gallery.show(character);
    }

    // Return result to WorldScene
    const worldScene = this.scene.get('WorldScene');
    worldScene.events.emit('battle-result', {
      won: result.correct,
      character,
      gold,
    });

    this.scene.stop();
  }
}
