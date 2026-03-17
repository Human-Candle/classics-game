import { ENCOUNTER_CHECK_STEPS, ENCOUNTER_CHANCE } from '../config';
import { randomChance } from '../utils/RandomUtils';
import type { ClassicalCharacter } from '../data/types';

export class EncounterSystem {
  private characters: ClassicalCharacter[];
  private capturedIds: Set<string>;
  private lastCheckStep = 0;

  constructor(characters: ClassicalCharacter[], capturedIds: string[]) {
    this.characters = characters;
    this.capturedIds = new Set(capturedIds);
  }

  updateCaptured(capturedIds: string[]): void {
    this.capturedIds = new Set(capturedIds);
  }

  checkEncounter(stepCount: number, playerTileX: number, playerTileY: number): ClassicalCharacter | null {
    if (stepCount - this.lastCheckStep < ENCOUNTER_CHECK_STEPS) return null;
    this.lastCheckStep = stepCount;

    if (!randomChance(ENCOUNTER_CHANCE)) return null;

    // Determine difficulty zone based on distance from spawn (10,10)
    const dist = Math.sqrt((playerTileX - 10) ** 2 + (playerTileY - 10) ** 2);
    let targetDifficulty: 'easy' | 'medium' | 'hard';
    if (dist < 20) targetDifficulty = 'easy';
    else if (dist < 40) targetDifficulty = 'medium';
    else targetDifficulty = 'hard';

    // Filter to uncaptured characters of appropriate difficulty
    const candidates = this.characters.filter(
      c => !this.capturedIds.has(c.id) && c.difficulty === targetDifficulty
    );

    // If no candidates at this difficulty, try any uncaptured
    const pool = candidates.length > 0
      ? candidates
      : this.characters.filter(c => !this.capturedIds.has(c.id));

    if (pool.length === 0) return null;

    return pool[Math.floor(Math.random() * pool.length)];
  }

  getRandomCharacter(): ClassicalCharacter | null {
    const uncaptured = this.characters.filter(c => !this.capturedIds.has(c.id));
    if (uncaptured.length === 0) return null;
    return uncaptured[Math.floor(Math.random() * uncaptured.length)];
  }
}
