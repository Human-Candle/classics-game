import Phaser from 'phaser';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, FOG_REVEAL_RADIUS } from '../config';

export class FogOfWar {
  private scene: Phaser.Scene;
  private rt: Phaser.GameObjects.RenderTexture;
  public revealedTiles: boolean[][];

  constructor(scene: Phaser.Scene, revealedTiles?: boolean[][]) {
    this.scene = scene;

    if (revealedTiles) {
      this.revealedTiles = revealedTiles;
    } else {
      this.revealedTiles = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        this.revealedTiles[x] = [];
        for (let y = 0; y < MAP_HEIGHT; y++) {
          this.revealedTiles[x][y] = false;
        }
      }
    }

    // Create the fog as a RenderTexture filled with dark color
    const mapW = MAP_WIDTH * TILE_SIZE;
    const mapH = MAP_HEIGHT * TILE_SIZE;
    this.rt = scene.add.renderTexture(0, 0, mapW, mapH);
    this.rt.setOrigin(0, 0);
    this.rt.setDepth(20);

    // Fill entirely with fog color
    this.rt.fill(0x0a0a1a, 1.0);

    // Create the erase brush: a simple filled circle on a canvas texture
    this.createBrushTexture();

    // Restore previously revealed areas
    this.restoreRevealed();
  }

  private createBrushTexture(): void {
    const key = '__fog_eraser__';
    if (this.scene.textures.exists(key)) return;

    const radiusPx = FOG_REVEAL_RADIUS * TILE_SIZE;
    const size = radiusPx * 2;
    const gfx = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // Soft-edged circle
    const steps = 20;
    for (let i = steps; i > 0; i--) {
      const r = (radiusPx * i) / steps;
      const alpha = i <= steps * 0.6 ? 1.0 : 1.0 - ((i - steps * 0.6) / (steps * 0.4));
      gfx.fillStyle(0xffffff, alpha);
      gfx.fillCircle(radiusPx, radiusPx, r);
    }

    gfx.generateTexture(key, size, size);
    gfx.destroy();
  }

  private restoreRevealed(): void {
    const key = '__fog_eraser__';
    const brush = this.scene.make.image({ x: 0, y: 0, key, add: false });

    for (let x = 0; x < MAP_WIDTH; x++) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
        if (this.revealedTiles[x]?.[y]) {
          const px = x * TILE_SIZE + TILE_SIZE / 2;
          const py = y * TILE_SIZE + TILE_SIZE / 2;
          this.rt.erase(brush, px, py);
        }
      }
    }

    brush.destroy();
  }

  reveal(tileX: number, tileY: number): void {
    const key = '__fog_eraser__';
    const brush = this.scene.make.image({ x: 0, y: 0, key, add: false });

    const pixelX = tileX * TILE_SIZE + TILE_SIZE / 2;
    const pixelY = tileY * TILE_SIZE + TILE_SIZE / 2;
    this.rt.erase(brush, pixelX, pixelY);
    brush.destroy();

    // Mark tiles as revealed
    const radius = FOG_REVEAL_RADIUS;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (dx * dx + dy * dy <= radius * radius) {
          const rx = tileX + dx;
          const ry = tileY + dy;
          if (rx >= 0 && rx < MAP_WIDTH && ry >= 0 && ry < MAP_HEIGHT) {
            this.revealedTiles[rx][ry] = true;
          }
        }
      }
    }
  }

  isTileRevealed(tileX: number, tileY: number): boolean {
    if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) return false;
    return this.revealedTiles[tileX]?.[tileY] ?? false;
  }

  destroy(): void {
    this.rt.destroy();
  }
}
