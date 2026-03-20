import Phaser from 'phaser';
import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from './config';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { WorldScene } from './scenes/WorldScene';
import { BattleScene } from './scenes/BattleScene';
import { ShopScene } from './scenes/ShopScene';
import { InventoryScene } from './scenes/InventoryScene';
import { BadgeScene } from './scenes/BadgeScene';
import { GameOverScene } from './scenes/GameOverScene';
import { IntroScene } from './scenes/IntroScene';
import { VictoryScene } from './scenes/VictoryScene';
import { GrottoScene } from './scenes/GrottoScene';
import { MusicScene } from './scenes/MusicScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: VIEWPORT_WIDTH,
  height: VIEWPORT_HEIGHT,
  pixelArt: false,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, TitleScene, IntroScene, WorldScene, BattleScene, ShopScene, InventoryScene, BadgeScene, GameOverScene, VictoryScene, GrottoScene, MusicScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
  },
};

new Phaser.Game(config);
