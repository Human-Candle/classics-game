import type { GameItem, Difficulty } from '../data/types';
import { randomInt } from '../utils/RandomUtils';

const CAPTURE_BOUNTIES: Record<Difficulty, [number, number]> = {
  easy: [10, 20],
  medium: [20, 30],
  hard: [30, 50],
};

export class EconomySystem {
  getSellPrice(item: GameItem): number {
    // Base value +/- 15% random variation
    const variation = 0.85 + Math.random() * 0.3;
    return Math.round(item.baseValue * variation);
  }

  getCaptureBounty(difficulty: Difficulty): number {
    const [min, max] = CAPTURE_BOUNTIES[difficulty];
    return randomInt(min, max);
  }
}
