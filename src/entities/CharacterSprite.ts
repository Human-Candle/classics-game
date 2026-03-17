import Phaser from 'phaser';

export type SpriteVariant = 'player' | 'male-author' | 'female-author' | 'male-artist' | 'female-artist';

interface SpriteColors {
  skin: number;
  hair: number;
  torso: number;
  legs: number;
  accent: number;
}

const VARIANT_COLORS: Record<SpriteVariant, SpriteColors> = {
  'player': { skin: 0xf0c8a0, hair: 0x2a2a3a, torso: 0x3a3a5a, legs: 0x2a2a3a, accent: 0xe8c170 },
  'male-author': { skin: 0xf0c8a0, hair: 0x5a3a2a, torso: 0x6b8cce, legs: 0x3a3a4a, accent: 0xffffff },
  'female-author': { skin: 0xf0c8a0, hair: 0x8b5a3a, torso: 0x6b8cce, legs: 0x6b8cce, accent: 0xffffff },
  'male-artist': { skin: 0xf0c8a0, hair: 0x4a3a2a, torso: 0xce6b8c, legs: 0x3a3a4a, accent: 0xffffff },
  'female-artist': { skin: 0xf0c8a0, hair: 0x6b3a2a, torso: 0xce6b8c, legs: 0xce6b8c, accent: 0xffffff },
};

export interface HumanoidParts {
  body: Phaser.GameObjects.Graphics;
  leftArm: Phaser.GameObjects.Graphics;
  rightArm: Phaser.GameObjects.Graphics;
  leftLeg: Phaser.GameObjects.Graphics;
  rightLeg: Phaser.GameObjects.Graphics;
  accessory: Phaser.GameObjects.Text | null;
}

export function drawHumanoid(
  scene: Phaser.Scene,
  variant: SpriteVariant,
  scale = 1
): HumanoidParts {
  const c = VARIANT_COLORS[variant];
  const s = scale;
  const isFemale = variant.startsWith('female');

  // Main body graphic (head + torso)
  const body = scene.add.graphics();

  // Hair/hat
  if (variant === 'player') {
    // Hood/mask
    body.fillStyle(c.hair);
    body.fillCircle(0, -8 * s, 6 * s);
    // Face slit
    body.fillStyle(c.skin);
    body.fillRect(-4 * s, -11 * s, 8 * s, 4 * s);
    // Eyes
    body.fillStyle(0x333333);
    body.fillRect(-3 * s, -10 * s, 2 * s, 2 * s);
    body.fillRect(1 * s, -10 * s, 2 * s, 2 * s);
    // Golden accent band
    body.fillStyle(c.accent);
    body.fillRect(-6 * s, -14 * s, 12 * s, 2 * s);
  } else {
    // Head
    body.fillStyle(c.skin);
    body.fillCircle(0, -8 * s, 5 * s);
    // Hair
    body.fillStyle(c.hair);
    if (isFemale) {
      // Longer hair
      body.fillRect(-5 * s, -14 * s, 10 * s, 5 * s);
      body.fillRect(-6 * s, -12 * s, 3 * s, 8 * s);
      body.fillRect(3 * s, -12 * s, 3 * s, 8 * s);
    } else {
      // Short hair
      body.fillRect(-5 * s, -14 * s, 10 * s, 5 * s);
    }
    // Eyes
    body.fillStyle(0x333333);
    body.fillRect(-3 * s, -9 * s, 2 * s, 2 * s);
    body.fillRect(1 * s, -9 * s, 2 * s, 2 * s);
  }

  // Torso
  body.fillStyle(c.torso);
  body.fillRect(-5 * s, -2 * s, 10 * s, 10 * s);

  // Belt/waist accent for player
  if (variant === 'player') {
    body.fillStyle(c.accent);
    body.fillRect(-5 * s, 6 * s, 10 * s, 2 * s);
  }

  // Arms
  const leftArm = scene.add.graphics();
  const rightArm = scene.add.graphics();

  leftArm.fillStyle(c.torso);
  leftArm.fillRect(-8 * s, -1 * s, 3 * s, 9 * s);
  leftArm.fillStyle(c.skin);
  leftArm.fillRect(-8 * s, 7 * s, 3 * s, 3 * s);

  rightArm.fillStyle(c.torso);
  rightArm.fillRect(5 * s, -1 * s, 3 * s, 9 * s);
  rightArm.fillStyle(c.skin);
  rightArm.fillRect(5 * s, 7 * s, 3 * s, 3 * s);

  // Legs
  const leftLeg = scene.add.graphics();
  const rightLeg = scene.add.graphics();

  if (isFemale) {
    // Skirt
    body.fillStyle(c.legs);
    body.fillTriangle(-7 * s, 8 * s, 7 * s, 8 * s, 0, 16 * s);
    // Small feet under skirt
    leftLeg.fillStyle(c.skin);
    leftLeg.fillRect(-3 * s, 14 * s, 3 * s, 3 * s);
    rightLeg.fillStyle(c.skin);
    rightLeg.fillRect(0 * s, 14 * s, 3 * s, 3 * s);
  } else {
    leftLeg.fillStyle(c.legs);
    leftLeg.fillRect(-4 * s, 8 * s, 3 * s, 8 * s);
    leftLeg.fillStyle(c.skin);
    leftLeg.fillRect(-4 * s, 15 * s, 3 * s, 2 * s);

    rightLeg.fillStyle(c.legs);
    rightLeg.fillRect(1 * s, 8 * s, 3 * s, 8 * s);
    rightLeg.fillStyle(c.skin);
    rightLeg.fillRect(1 * s, 15 * s, 3 * s, 2 * s);
  }

  // Accessory icon
  let accessory: Phaser.GameObjects.Text | null = null;
  if (variant.includes('author')) {
    accessory = scene.add.text(7 * s, -2 * s, '📖', { fontSize: `${8 * s}px` }).setOrigin(0.5);
  } else if (variant.includes('artist')) {
    accessory = scene.add.text(7 * s, -2 * s, '🖌️', { fontSize: `${8 * s}px` }).setOrigin(0.5);
  }

  return { body, leftArm, rightArm, leftLeg, rightLeg, accessory };
}

export function addWalkAnimation(
  scene: Phaser.Scene,
  parts: HumanoidParts,
  duration: number
): Phaser.Tweens.Tween[] {
  const tweens: Phaser.Tweens.Tween[] = [];

  // Arm swing
  tweens.push(scene.tweens.add({
    targets: parts.leftArm,
    y: -3,
    duration: duration / 2,
    yoyo: true,
    ease: 'Sine.easeInOut',
  }));
  tweens.push(scene.tweens.add({
    targets: parts.rightArm,
    y: 3,
    duration: duration / 2,
    yoyo: true,
    ease: 'Sine.easeInOut',
  }));

  // Leg swing (opposite to arms)
  tweens.push(scene.tweens.add({
    targets: parts.leftLeg,
    x: 2,
    duration: duration / 2,
    yoyo: true,
    ease: 'Sine.easeInOut',
  }));
  tweens.push(scene.tweens.add({
    targets: parts.rightLeg,
    x: -2,
    duration: duration / 2,
    yoyo: true,
    ease: 'Sine.easeInOut',
  }));

  return tweens;
}

export function addIdleSway(
  scene: Phaser.Scene,
  parts: HumanoidParts
): Phaser.Tweens.Tween[] {
  const tweens: Phaser.Tweens.Tween[] = [];

  tweens.push(scene.tweens.add({
    targets: parts.leftArm,
    y: -1,
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  }));
  tweens.push(scene.tweens.add({
    targets: parts.rightArm,
    y: 1,
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
    delay: 600,
  }));

  return tweens;
}
