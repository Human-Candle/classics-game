import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config';
import { getEraStyles, type StyleEntry } from '../data/eraStyles';
import type { StageMapConfig } from '../data/stages';
import { WikimediaService } from '../utils/WikimediaService';

export class GrottoScene extends Phaser.Scene {
  private contentContainer!: Phaser.GameObjects.Container;
  private scrollY = 0;
  private maxScroll = 0;
  private activeTab: 'writing' | 'art' = 'writing';
  private stageConfig!: StageMapConfig;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private reachedBottom = false;
  private writingTab!: Phaser.GameObjects.Text;
  private artTab!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GrottoScene' });
  }

  create(data: { stageConfig: StageMapConfig }): void {
    this.stageConfig = data.stageConfig;
    this.scrollY = 0;
    this.reachedBottom = false;

    // Full-screen overlay
    this.add.rectangle(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0x000000, 0.92);

    // Title
    this.add.text(VIEWPORT_WIDTH / 2, 25, 'Grotto of Knowledge', {
      fontSize: '24px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Era subtitle
    this.add.text(VIEWPORT_WIDTH / 2, 50, `${this.stageConfig.name}  (${this.stageConfig.eraRange})`, {
      fontSize: '14px',
      color: '#c0a0ff',
    }).setOrigin(0.5);

    // Tabs
    this.createTabs();

    // Content area with mask for scrolling
    this.contentContainer = this.add.container(0, 0);

    // Scroll hint
    // Bottom bar background
    this.add.rectangle(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 15, VIEWPORT_WIDTH, 24, 0x000000, 0.8);

    this.add.text(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 15, '[SPACE] Close  |  Scroll: WASD / Arrow Keys / Mouse Wheel', {
      fontSize: '11px',
      color: '#888888',
    }).setOrigin(0.5);

    // Mask content area so it doesn't overflow into header/footer
    const maskGraphics = this.make.graphics({});
    maskGraphics.fillRect(0, 90, VIEWPORT_WIDTH, VIEWPORT_HEIGHT - 120);
    const mask = maskGraphics.createGeometryMask();
    this.contentContainer.setMask(mask);

    // Show initial tab
    this.showTab('writing');

    // Input
    this.input.keyboard!.on('keydown-SPACE', () => this.closeScene());

    // Mouse wheel scrolling
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _currentlyOver: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number) => {
      this.scroll(deltaY > 0 ? 50 : -50);
    });

    // Cursor keys + WASD for scrolling in update()
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey('W'),
      S: this.input.keyboard!.addKey('S'),
    };
  }

  update(): void {
    const scrollSpeed = 4;
    if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.scroll(scrollSpeed);
    } else if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.scroll(-scrollSpeed);
    }
  }

  private createTabs(): void {
    const tabY = 72;

    this.writingTab = this.add.text(VIEWPORT_WIDTH / 2 - 85, tabY, 'Writing Styles', {
      fontSize: '15px',
      color: '#ffd700',
      fontStyle: 'bold',
      backgroundColor: '#333366',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.artTab = this.add.text(VIEWPORT_WIDTH / 2 + 85, tabY, 'Art Styles', {
      fontSize: '15px',
      color: '#aaaaaa',
      backgroundColor: '#1a1a3a',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.writingTab.on('pointerdown', () => this.switchTab('writing'));
    this.artTab.on('pointerdown', () => this.switchTab('art'));
  }

  private switchTab(tab: 'writing' | 'art'): void {
    this.activeTab = tab;
    if (tab === 'writing') {
      this.writingTab.setColor('#ffd700').setFontStyle('bold').setBackgroundColor('#333366');
      this.artTab.setColor('#aaaaaa').setFontStyle('normal').setBackgroundColor('#1a1a3a');
    } else {
      this.artTab.setColor('#ffd700').setFontStyle('bold').setBackgroundColor('#333366');
      this.writingTab.setColor('#aaaaaa').setFontStyle('normal').setBackgroundColor('#1a1a3a');
    }
    this.showTab(tab);
  }

  private showTab(tab: 'writing' | 'art'): void {
    this.contentContainer.removeAll(true);
    this.scrollY = 0;

    const era = getEraStyles(this.stageConfig.stage);
    if (!era) return;

    const styles = tab === 'writing' ? era.writingStyles : era.artStyles;
    const contentTop = 95;
    let y = contentTop;

    for (const style of styles) {
      y = this.renderStyleEntry(style, y, tab);
      y += 20; // gap between entries
    }

    // At the end of the writing tab, add a button to continue to art styles
    if (tab === 'writing') {
      y += 10;
      const nextBtn = this.add.text(VIEWPORT_WIDTH / 2, y, 'Continue to Art Styles  ▸', {
        fontSize: '16px',
        color: '#ffd700',
        fontStyle: 'bold',
        backgroundColor: '#333366',
        padding: { x: 16, y: 8 },
      }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
      this.contentContainer.add(nextBtn);

      nextBtn.on('pointerover', () => nextBtn.setColor('#ffffff'));
      nextBtn.on('pointerout', () => nextBtn.setColor('#ffd700'));
      nextBtn.on('pointerdown', () => this.switchTab('art'));
      y += nextBtn.height + 30;
    }

    // Content runs from y=95 to y. Visible area is ~90 to ~(HEIGHT-30).
    // maxScroll = how far the container needs to shift up so the bottom content is visible.
    const visibleBottom = VIEWPORT_HEIGHT - 30;
    this.maxScroll = Math.max(0, y - visibleBottom);
    this.updateScroll();
  }

  private renderStyleEntry(style: StyleEntry, startY: number, tab: 'writing' | 'art'): number {
    let y = startY;
    const margin = 40;
    const contentWidth = VIEWPORT_WIDTH - margin * 2;

    // Style name
    const nameText = this.add.text(margin, y, style.name, {
      fontSize: '20px',
      color: '#ffd700',
      fontStyle: 'bold',
    });
    this.contentContainer.add(nameText);
    y += 30;

    // Description
    const descText = this.add.text(margin, y, style.description, {
      fontSize: '14px',
      color: '#eee8d5',
      wordWrap: { width: contentWidth },
      lineSpacing: 3,
    });
    this.contentContainer.add(descText);
    y += descText.height + 12;

    // Cultural context
    const contextLabel = this.add.text(margin, y, 'Cultural Context:', {
      fontSize: '13px',
      color: '#c0a0ff',
      fontStyle: 'bold',
    });
    this.contentContainer.add(contextLabel);
    y += 20;

    const contextText = this.add.text(margin + 10, y, style.culturalContext, {
      fontSize: '13px',
      color: '#bbbbbb',
      wordWrap: { width: contentWidth - 10 },
      lineSpacing: 3,
      fontStyle: 'italic',
    });
    this.contentContainer.add(contextText);
    y += contextText.height + 12;

    // Excerpt (writing styles)
    if (style.excerpt) {
      const excerptBg = this.add.rectangle(
        VIEWPORT_WIDTH / 2, y + 5, contentWidth, 10, 0x1a1a3a
      ).setOrigin(0.5, 0);
      this.contentContainer.add(excerptBg);

      const excerptText = this.add.text(margin + 15, y + 12, style.excerpt, {
        fontSize: '14px',
        color: '#d4c8a0',
        wordWrap: { width: contentWidth - 30 },
        lineSpacing: 4,
        fontStyle: 'italic',
      });
      this.contentContainer.add(excerptText);

      // Resize background to fit
      excerptBg.setSize(contentWidth, excerptText.height + 24);
      y += excerptText.height + 36;
    }

    // Art example image (art styles)
    if (style.exampleTitle && tab === 'art') {
      const loadingText = this.add.text(margin, y, `Loading: ${style.exampleTitle}...`, {
        fontSize: '12px',
        color: '#888888',
      });
      this.contentContainer.add(loadingText);
      y += 22; // space below the title text

      const imageY = y;
      y += 150; // reserve space for image (below the title)

      // Load image async
      this.loadStyleImage(style, loadingText, imageY, margin);
    }

    // Separator line
    const sep = this.add.graphics();
    sep.lineStyle(1, 0x444444, 0.5);
    sep.lineBetween(margin, y, VIEWPORT_WIDTH - margin, y);
    this.contentContainer.add(sep);
    y += 5;

    return y;
  }

  private async loadStyleImage(
    style: StyleEntry, loadingText: Phaser.GameObjects.Text,
    y: number, margin: number
  ): Promise<void> {
    const searchTerm = style.exampleTitle ?? style.name;
    const imageUrl = await WikimediaService.getImageUrl(searchTerm, style.exampleArtist);
    if (!imageUrl || !this.scene.isActive()) return;

    const key = `grotto-${style.name.replace(/\s/g, '-').toLowerCase()}`;
    const loaded = await WikimediaService.loadImageIntoPhaser(this, key, imageUrl);

    if (loaded && this.scene.isActive()) {
      loadingText.setText(style.exampleTitle ?? '');
      loadingText.setColor('#aaaaaa');
      loadingText.setFontStyle('italic');

      const image = this.add.image(0, 0, key);
      const maxW = 240;
      const maxH = 140;
      const scale = Math.min(maxW / image.width, maxH / image.height, 1);
      image.setScale(scale);
      image.setOrigin(0.5, 0);
      image.setPosition(margin + 120, y);
      this.contentContainer.add(image);
    } else if (this.scene.isActive()) {
      loadingText.setText(`${style.exampleTitle ?? 'Image'} (not found)`);
      loadingText.setColor('#666666');
    }
  }

  private scroll(delta: number): void {
    this.scrollY = Math.max(0, Math.min(this.maxScroll, this.scrollY + delta));
    this.updateScroll();

    if (this.maxScroll > 0 && this.scrollY >= this.maxScroll) {
      this.reachedBottom = true;
    }
  }

  private updateScroll(): void {
    this.contentContainer.setY(-this.scrollY);
  }

  private closeScene(): void {
    const readToEnd = this.reachedBottom;
    this.input.keyboard?.removeAllListeners();
    this.scene.stop();
    this.scene.resume('WorldScene');
    const world = this.scene.get('WorldScene');
    world.events.emit('shop-closed');
    if (readToEnd) {
      world.events.emit('grotto-read', this.stageConfig.stage);
    }
  }
}
