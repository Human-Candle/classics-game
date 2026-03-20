import type { Difficulty } from './types';

export interface LevelConfig {
  level: number;
  name: string;
  capturesRequired: number;
  capturesForNext: number;
  questionsRequired: Record<Difficulty, number>;
  reward: {
    goldBonus: number;
    livesRestored: number;
    maxLifeIncrease: number;
    message: string;
  };
}

export const TOTAL_CHARACTERS = 40;

export const levels: LevelConfig[] = [
  {
    level: 1,
    name: 'The Novice',
    capturesRequired: 0,
    capturesForNext: 3,
    questionsRequired: { easy: 1, medium: 1, hard: 1 },
    reward: { goldBonus: 0, livesRestored: 0, maxLifeIncrease: 0, message: '' },
  },
  {
    level: 2,
    name: 'The Student',
    capturesRequired: 3,
    capturesForNext: 7,
    questionsRequired: { easy: 1, medium: 1, hard: 1 },
    reward: {
      goldBonus: 25,
      livesRestored: 1,
      maxLifeIncrease: 0,
      message: 'The Medieval World awaits your exploration!',
    },
  },
  {
    level: 3,
    name: 'The Scholar',
    capturesRequired: 7,
    capturesForNext: 12,
    questionsRequired: { easy: 1, medium: 2, hard: 2 },
    reward: {
      goldBonus: 50,
      livesRestored: 0,
      maxLifeIncrease: 1,
      message: 'The Renaissance world opens before you!',
    },
  },
  {
    level: 4,
    name: 'The Connoisseur',
    capturesRequired: 12,
    capturesForNext: 18,
    questionsRequired: { easy: 1, medium: 2, hard: 2 },
    reward: {
      goldBonus: 75,
      livesRestored: 1,
      maxLifeIncrease: 0,
      message: 'The Baroque era dawns. Sharper minds lie ahead!',
    },
  },
  {
    level: 5,
    name: 'The Expert',
    capturesRequired: 18,
    capturesForNext: 25,
    questionsRequired: { easy: 2, medium: 2, hard: 2 },
    reward: {
      goldBonus: 100,
      livesRestored: 0,
      maxLifeIncrease: 1,
      message: 'The age of Enlightenment & Romanticism calls!',
    },
  },
  {
    level: 6,
    name: 'The Master',
    capturesRequired: 25,
    capturesForNext: 32,
    questionsRequired: { easy: 2, medium: 2, hard: 2 },
    reward: {
      goldBonus: 125,
      livesRestored: 1,
      maxLifeIncrease: 0,
      message: 'Impressionism & New Worlds emerge!',
    },
  },
  {
    level: 7,
    name: 'The Legend',
    capturesRequired: 32,
    capturesForNext: 40,
    questionsRequired: { easy: 2, medium: 2, hard: 3 },
    reward: {
      goldBonus: 0,
      livesRestored: 0,
      maxLifeIncrease: 0,
      message: 'The final challenge. Capture the legends of the Modern Age!',
    },
  },
];

export function getLevelForCaptures(captureCount: number): LevelConfig {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (captureCount >= levels[i].capturesRequired) {
      return levels[i];
    }
  }
  return levels[0];
}

export function getNextLevel(currentLevel: number): LevelConfig | null {
  const idx = levels.findIndex(l => l.level === currentLevel);
  if (idx >= 0 && idx < levels.length - 1) {
    return levels[idx + 1];
  }
  return null;
}
