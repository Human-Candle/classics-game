import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, COLORS } from '../config';
import type { CharacterEntity } from '../entities/Character';
import type { LocationEntity } from '../entities/Location';

const MINIMAP_W = 150;
const PADDING = 8;

export class Minimap {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private graphics: Phaser.GameObjects.Graphics;
  private playerDot: Phaser.GameObjects.Rectangle;
  private mapWidth: number;
  private mapHeight: number;
  private scaleX: number;
  private scaleY: number;
  private minimapH: number;

  constructor(scene: Phaser.Scene, mapWidth: number, mapHeight: number) {
    this.scene = scene;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.minimapH = Math.round(MINIMAP_W * mapHeight / mapWidth);
    this.scaleX = MINIMAP_W / mapWidth;
    this.scaleY = this.minimapH / mapHeight;

    const x = VIEWPORT_WIDTH - MINIMAP_W - PADDING;
    const y = VIEWPORT_HEIGHT - this.minimapH - PADDING;

    this.container = scene.add.container(x, y);
    this.container.setDepth(90);
    this.container.setScrollFactor(0);

    // Background
    const bg = scene.add.rectangle(MINIMAP_W / 2, this.minimapH / 2, MINIMAP_W + 2, this.minimapH + 2, 0x000000, 0.6);
    bg.setStrokeStyle(1, 0x555555);
    this.container.add(bg);

    // Graphics layer for terrain
    this.graphics = scene.add.graphics();
    this.container.add(this.graphics);

    // Player dot (always on top)
    this.playerDot = scene.add.rectangle(0, 0, 4, 4, COLORS.gold);
    this.container.add(this.playerDot);
  }

  update(
    playerX: number,
    playerY: number,
    revealedTiles: boolean[][],
    collisionMap: boolean[][],
    characterEntities: CharacterEntity[],
    locationEntities: LocationEntity[]
  ): void {
    this.graphics.clear();

    // Draw revealed terrain
    for (let x = 0; x < this.mapWidth; x++) {
      if (!revealedTiles[x]) continue;
      for (let y = 0; y < this.mapHeight; y++) {
        if (!revealedTiles[x][y]) continue;

        const px = x * this.scaleX;
        const py = y * this.scaleY;

        // Determine terrain type from collision and position
        const isBorder = x <= 1 || x >= this.mapWidth - 2 || y <= 1 || y >= this.mapHeight - 2;
        if (isBorder) {
          this.graphics.fillStyle(0x2a4a6e, 0.8); // water
        } else if (collisionMap[x]?.[y]) {
          this.graphics.fillStyle(0x1a4010, 0.8); // forest/obstacle
        } else {
          this.graphics.fillStyle(0x3a5a3f, 0.6); // grass (muted)
        }
        this.graphics.fillRect(px, py, Math.ceil(this.scaleX), Math.ceil(this.scaleY));
      }
    }

    // Draw locations as colored dots
    for (const loc of locationEntities) {
      if (!revealedTiles[loc.tileX]?.[loc.tileY]) continue;
      const px = loc.tileX * this.scaleX;
      const py = loc.tileY * this.scaleY;
      this.graphics.fillStyle(0xffd700, 1);
      this.graphics.fillRect(px - 1, py - 1, 3, 3);
    }

    // Draw characters as colored dots
    for (const ce of characterEntities) {
      if (ce.captured) continue;
      if (!revealedTiles[ce.tileX]?.[ce.tileY]) continue;
      const px = ce.tileX * this.scaleX;
      const py = ce.tileY * this.scaleY;
      const color = ce.characterData.type === 'author' ? 0x6b8cce : 0xce6b8c;
      this.graphics.fillStyle(color, 1);
      this.graphics.fillRect(px, py, 2, 2);
    }

    // Update player dot
    this.playerDot.setPosition(playerX * this.scaleX, playerY * this.scaleY);
  }

  destroy(): void {
    this.container.destroy();
  }
}
