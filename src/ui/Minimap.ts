import Phaser from 'phaser';
import { MAP_WIDTH, MAP_HEIGHT, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, COLORS } from '../config';
import type { CharacterEntity } from '../entities/Character';
import type { LocationEntity } from '../entities/Location';

const MINIMAP_W = 150;
const MINIMAP_H = Math.round(MINIMAP_W * MAP_HEIGHT / MAP_WIDTH); // 112
const SCALE_X = MINIMAP_W / MAP_WIDTH;
const SCALE_Y = MINIMAP_H / MAP_HEIGHT;
const PADDING = 8;

export class Minimap {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private graphics: Phaser.GameObjects.Graphics;
  private playerDot: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const x = VIEWPORT_WIDTH - MINIMAP_W - PADDING;
    const y = VIEWPORT_HEIGHT - MINIMAP_H - PADDING;

    this.container = scene.add.container(x, y);
    this.container.setDepth(90);
    this.container.setScrollFactor(0);

    // Background
    const bg = scene.add.rectangle(MINIMAP_W / 2, MINIMAP_H / 2, MINIMAP_W + 2, MINIMAP_H + 2, 0x000000, 0.6);
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
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (!revealedTiles[x]) continue;
      for (let y = 0; y < MAP_HEIGHT; y++) {
        if (!revealedTiles[x][y]) continue;

        const px = x * SCALE_X;
        const py = y * SCALE_Y;

        // Determine terrain type from collision and position
        const isBorder = x <= 1 || x >= MAP_WIDTH - 2 || y <= 1 || y >= MAP_HEIGHT - 2;
        if (isBorder) {
          this.graphics.fillStyle(0x2a4a6e, 0.8); // water
        } else if (collisionMap[x]?.[y]) {
          this.graphics.fillStyle(0x1a4010, 0.8); // forest/obstacle
        } else {
          // Check if likely a path (near known path color, non-collision, non-grass-pattern)
          this.graphics.fillStyle(0x3a5a3f, 0.6); // grass (muted)
        }
        this.graphics.fillRect(px, py, Math.ceil(SCALE_X), Math.ceil(SCALE_Y));
      }
    }

    // Draw locations as colored dots
    for (const loc of locationEntities) {
      if (!revealedTiles[loc.tileX]?.[loc.tileY]) continue;
      const px = loc.tileX * SCALE_X;
      const py = loc.tileY * SCALE_Y;
      this.graphics.fillStyle(0xffd700, 1);
      this.graphics.fillRect(px - 1, py - 1, 3, 3);
    }

    // Draw characters as colored dots
    for (const ce of characterEntities) {
      if (ce.captured) continue;
      if (!revealedTiles[ce.tileX]?.[ce.tileY]) continue;
      const px = ce.tileX * SCALE_X;
      const py = ce.tileY * SCALE_Y;
      const color = ce.characterData.type === 'author' ? 0x6b8cce : 0xce6b8c;
      this.graphics.fillStyle(color, 1);
      this.graphics.fillRect(px, py, 2, 2);
    }

    // Update player dot
    this.playerDot.setPosition(playerX * SCALE_X, playerY * SCALE_Y);
  }

  destroy(): void {
    this.container.destroy();
  }
}
