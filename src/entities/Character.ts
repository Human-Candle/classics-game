import Phaser from 'phaser';
import { TILE_SIZE } from '../config';
import type { ClassicalCharacter } from '../data/types';
import { drawHumanoid, addIdleSway, type SpriteVariant, type HumanoidParts } from './CharacterSprite';

export class CharacterEntity extends Phaser.GameObjects.Container {
  public tileX: number;
  public tileY: number;
  public characterData: ClassicalCharacter;
  public captured = false;
  private label: Phaser.GameObjects.Text;
  private parts: HumanoidParts;

  constructor(scene: Phaser.Scene, tileX: number, tileY: number, data: ClassicalCharacter) {
    super(scene, tileX * TILE_SIZE + TILE_SIZE / 2, tileY * TILE_SIZE + TILE_SIZE / 2);
    this.tileX = tileX;
    this.tileY = tileY;
    this.characterData = data;

    // Determine sprite variant
    const variant: SpriteVariant = `${data.gender}-${data.type}` as SpriteVariant;
    this.parts = drawHumanoid(scene, variant);

    this.add(this.parts.body);
    this.add(this.parts.leftArm);
    this.add(this.parts.rightArm);
    this.add(this.parts.leftLeg);
    this.add(this.parts.rightLeg);
    if (this.parts.accessory) {
      this.add(this.parts.accessory);
    }

    // Name label
    this.label = scene.add.text(0, -22, data.name.split(' ').pop()!, {
      fontSize: '8px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 2, y: 1 },
    }).setOrigin(0.5);
    this.add(this.label);

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
    this.setDepth(9);

    // Idle float animation
    scene.tweens.add({
      targets: this,
      y: this.y - 3,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Idle arm sway
    addIdleSway(scene, this.parts);
  }
}
