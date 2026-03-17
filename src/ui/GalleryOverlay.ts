import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';
import { WikimediaService } from '../utils/WikimediaService';
import type { ClassicalCharacter } from '../data/types';

export class GalleryOverlay {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private resolve?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(400);
    this.container.setScrollFactor(0);
  }

  async show(character: ClassicalCharacter): Promise<void> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.container.removeAll(true);

      // Dark overlay
      const overlay = this.scene.add.rectangle(
        VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2,
        VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x000000, 0.92
      );
      this.container.add(overlay);

      // Title
      const title = this.scene.add.text(VIEWPORT_WIDTH / 2, 35, `Works of ${character.name}`, {
        fontSize: '20px',
        color: '#ffd700',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.container.add(title);

      const subtitle = this.scene.add.text(VIEWPORT_WIDTH / 2, 58, character.type === 'author' ? 'Famous Passages' : 'Famous Works', {
        fontSize: '12px',
        color: '#aaaaaa',
      }).setOrigin(0.5);
      this.container.add(subtitle);

      if (character.type === 'artist') {
        this.showArtistGallery(character);
      } else {
        this.showAuthorGallery(character);
      }

      // Continue button (placed at bottom)
      const continueBtn = this.scene.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 30,
        '[ Continue ]', {
          fontSize: '16px',
          color: '#ffd700',
          fontStyle: 'bold',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      this.container.add(continueBtn);

      continueBtn.on('pointerover', () => continueBtn.setColor('#ffffff'));
      continueBtn.on('pointerout', () => continueBtn.setColor('#ffd700'));
      continueBtn.on('pointerdown', () => this.close());

      this.scene.input.keyboard!.once('keydown-SPACE', () => this.close());
    });
  }

  private async showArtistGallery(character: ClassicalCharacter): Promise<void> {
    const works = character.notableWorks.slice(0, 3);
    const cardWidth = 200;
    const cardHeight = 280;
    const gap = 30;
    const totalWidth = works.length * cardWidth + (works.length - 1) * gap;
    const startX = (VIEWPORT_WIDTH - totalWidth) / 2 + cardWidth / 2;
    const cardY = 85 + cardHeight / 2;

    for (let i = 0; i < works.length; i++) {
      const x = startX + i * (cardWidth + gap);
      const workTitle = works[i];

      // Card background
      const cardBg = this.scene.add.rectangle(x, cardY, cardWidth, cardHeight, 0x1a1a3a);
      cardBg.setStrokeStyle(1, 0x3a3a5a);
      this.container.add(cardBg);

      // Loading text
      const loadingText = this.scene.add.text(x, cardY - 30, 'Loading...', {
        fontSize: '11px',
        color: '#666666',
      }).setOrigin(0.5);
      this.container.add(loadingText);

      // Work title below the card
      const titleText = this.scene.add.text(x, cardY + cardHeight / 2 - 30, workTitle, {
        fontSize: '11px',
        color: '#eee8d5',
        fontStyle: 'bold',
        wordWrap: { width: cardWidth - 16 },
        align: 'center',
      }).setOrigin(0.5);
      this.container.add(titleText);

      // Fetch image asynchronously
      this.loadArtworkImage(workTitle, character.name, x, cardY - 30, cardWidth - 20, loadingText);
    }
  }

  private async loadArtworkImage(
    workTitle: string, creatorName: string,
    x: number, y: number, maxWidth: number,
    loadingText: Phaser.GameObjects.Text
  ): Promise<void> {
    const imageUrl = await WikimediaService.getImageUrl(workTitle, creatorName);
    if (!imageUrl || !this.container.active) return;

    const key = `gallery-${workTitle.replace(/\s+/g, '-').toLowerCase()}`;
    const loaded = await WikimediaService.loadImageIntoPhaser(this.scene, key, imageUrl);

    if (loaded && this.container.active) {
      loadingText.setVisible(false);
      const image = this.scene.add.image(x, y, key);
      // Scale to fit within card
      const maxHeight = 180;
      const scaleX = maxWidth / image.width;
      const scaleY = maxHeight / image.height;
      const scale = Math.min(scaleX, scaleY, 1);
      image.setScale(scale);
      this.container.add(image);
    } else if (this.container.active) {
      loadingText.setText('Image\nnot found');
      loadingText.setAlign('center');
    }
  }

  private showAuthorGallery(character: ClassicalCharacter): void {
    const excerpts = (character.famousExcerpts ?? []).slice(0, 3);
    if (excerpts.length === 0) return;

    const cardWidth = 220;
    const cardHeight = 280;
    const gap = 20;
    const totalWidth = excerpts.length * cardWidth + (excerpts.length - 1) * gap;
    const startX = (VIEWPORT_WIDTH - totalWidth) / 2 + cardWidth / 2;
    const cardY = 85 + cardHeight / 2;

    for (let i = 0; i < excerpts.length; i++) {
      const x = startX + i * (cardWidth + gap);
      const entry = excerpts[i];

      // Card background
      const cardBg = this.scene.add.rectangle(x, cardY, cardWidth, cardHeight, 0x1a1a3a);
      cardBg.setStrokeStyle(1, 0x4a4a7a);
      this.container.add(cardBg);

      // Book icon
      const icon = this.scene.add.text(x, cardY - cardHeight / 2 + 30, '📖', {
        fontSize: '28px',
      }).setOrigin(0.5);
      this.container.add(icon);

      // Work title
      const titleText = this.scene.add.text(x, cardY - cardHeight / 2 + 60, entry.work, {
        fontSize: '13px',
        color: '#ffd700',
        fontStyle: 'bold',
        wordWrap: { width: cardWidth - 24 },
        align: 'center',
      }).setOrigin(0.5);
      this.container.add(titleText);

      // Excerpt
      const excerptText = this.scene.add.text(x, cardY + 10, entry.excerpt, {
        fontSize: '10px',
        color: '#cccccc',
        fontStyle: 'italic',
        wordWrap: { width: cardWidth - 24 },
        align: 'center',
        lineSpacing: 3,
      }).setOrigin(0.5);
      this.container.add(excerptText);
    }
  }

  private close(): void {
    this.container.destroy();
    this.resolve?.();
  }
}
