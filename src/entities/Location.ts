import Phaser from 'phaser';
import { TILE_SIZE } from '../config';
import type { LootableLocation } from '../data/types';

const LOCATION_COLORS: Record<string, number> = {
  monastery: 0x8b6914,
  library: 0x4a6741,
  gallery: 0x6b4a6b,
  collector: 0x6b6b4a,
};

export class LocationEntity extends Phaser.GameObjects.Container {
  public tileX: number;
  public tileY: number;
  public locationData: LootableLocation;
  public lastLootTime = 0;
  private building: Phaser.GameObjects.Rectangle;
  private roof: Phaser.GameObjects.Triangle;
  private nameLabel: Phaser.GameObjects.Text;
  public interactPrompt: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, data: LootableLocation) {
    const cx = data.position.x * TILE_SIZE + TILE_SIZE;
    const cy = data.position.y * TILE_SIZE + TILE_SIZE;
    super(scene, cx, cy);
    this.tileX = data.position.x;
    this.tileY = data.position.y;
    this.locationData = data;

    const color = LOCATION_COLORS[data.type] || 0x888888;

    // Building body (2x2 tiles)
    this.building = scene.add.rectangle(0, 8, TILE_SIZE * 2 - 4, TILE_SIZE * 1.5, color);
    this.building.setStrokeStyle(2, 0x333333);
    this.add(this.building);

    // Roof
    this.roof = scene.add.triangle(0, -12, -TILE_SIZE + 2, 12, TILE_SIZE - 2, 12, 0, -8, color + 0x222222);
    this.add(this.roof);

    // Door
    const door = scene.add.rectangle(0, 18, 12, 16, 0x4a3728);
    this.add(door);

    // Name label
    this.nameLabel = scene.add.text(0, -30, data.name, {
      fontSize: '8px',
      color: '#ffd700',
      backgroundColor: '#00000099',
      padding: { x: 3, y: 2 },
      align: 'center',
    }).setOrigin(0.5);
    this.add(this.nameLabel);

    // Years label
    const yearsText = `${data.yearFounded < 0 ? Math.abs(data.yearFounded) + ' BC' : data.yearFounded} - ${data.yearClosed ?? 'present'}`;
    const yearsLabel = scene.add.text(0, -22, yearsText, {
      fontSize: '7px',
      color: '#cccccc',
      backgroundColor: '#00000099',
      padding: { x: 2, y: 1 },
    }).setOrigin(0.5);
    this.add(yearsLabel);

    // Interact prompt (hidden by default)
    this.interactPrompt = scene.add.text(0, -42, '[E] Loot', {
      fontSize: '10px',
      color: '#ffffff',
      backgroundColor: '#e74c3c',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5).setVisible(false);
    this.add(this.interactPrompt);

    scene.add.existing(this);
    this.setDepth(5);
  }

  isOnCooldown(now: number, cooldownMs: number = 30000): boolean {
    return now - this.lastLootTime < cooldownMs;
  }

  isPlayerAdjacent(playerTileX: number, playerTileY: number): boolean {
    const dx = Math.abs(playerTileX - this.tileX);
    const dy = Math.abs(playerTileY - this.tileY);
    return dx <= 2 && dy <= 2;
  }
}
