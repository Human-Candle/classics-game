import Phaser from 'phaser';
import { TILE_SIZE, PLAYER_MOVE_DURATION } from '../config';
import { drawHumanoid, addWalkAnimation, type HumanoidParts } from './CharacterSprite';

export class Player extends Phaser.GameObjects.Container {
  public tileX: number;
  public tileY: number;
  public isMoving = false;
  public stepCount = 0;
  public facing: 'up' | 'down' | 'left' | 'right' = 'down';
  private parts: HumanoidParts;
  private walkTweens: Phaser.Tweens.Tween[] = [];

  constructor(scene: Phaser.Scene, tileX: number, tileY: number) {
    super(scene, tileX * TILE_SIZE + TILE_SIZE / 2, tileY * TILE_SIZE + TILE_SIZE / 2);
    this.tileX = tileX;
    this.tileY = tileY;

    this.parts = drawHumanoid(scene, 'player');
    this.add(this.parts.body);
    this.add(this.parts.leftArm);
    this.add(this.parts.rightArm);
    this.add(this.parts.leftLeg);
    this.add(this.parts.rightLeg);

    scene.add.existing(this);
    this.setDepth(25);
  }

  moveToTile(tileX: number, tileY: number, onComplete?: () => void): void {
    if (this.isMoving) return;
    this.isMoving = true;
    this.tileX = tileX;
    this.tileY = tileY;

    // Start walk animation
    this.walkTweens = addWalkAnimation(this.scene, this.parts, PLAYER_MOVE_DURATION);

    this.scene.tweens.add({
      targets: this,
      x: tileX * TILE_SIZE + TILE_SIZE / 2,
      y: tileY * TILE_SIZE + TILE_SIZE / 2,
      duration: PLAYER_MOVE_DURATION,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false;
        this.stepCount++;
        // Stop walk animation and reset positions
        this.walkTweens.forEach(t => t.stop());
        this.walkTweens = [];
        this.parts.leftArm.setPosition(0, 0);
        this.parts.rightArm.setPosition(0, 0);
        this.parts.leftLeg.setPosition(0, 0);
        this.parts.rightLeg.setPosition(0, 0);
        onComplete?.();
      },
    });
  }

  setFacing(dir: 'up' | 'down' | 'left' | 'right'): void {
    this.facing = dir;
  }
}
