import { MAX_LIVES_CAP } from '../config';
import type { PlayerState } from '../utils/SaveManager';

export class HealthSystem {
  loseLife(state: PlayerState): boolean {
    state.lives = Math.max(0, state.lives - 1);
    return state.lives <= 0;
  }

  restoreLives(state: PlayerState, amount: number): void {
    state.lives = Math.min(state.maxLives, state.lives + amount);
  }

  increaseMaxLives(state: PlayerState, amount: number): void {
    state.maxLives = Math.min(MAX_LIVES_CAP, state.maxLives + amount);
    state.lives = Math.min(state.maxLives, state.lives + amount);
  }
}
