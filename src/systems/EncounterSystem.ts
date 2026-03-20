import { ENCOUNTER_CHECK_STEPS, ENCOUNTER_CHANCE } from '../config';
import { randomChance } from '../utils/RandomUtils';
import type { ClassicalCharacter } from '../data/types';

export class EncounterSystem {
  private characters: ClassicalCharacter[];
  private capturedIds: Set<string>;
  private lastCheckStep = 0;
  private allowedIds: Set<string> = new Set();

  constructor(characters: ClassicalCharacter[], capturedIds: string[]) {
    this.characters = characters;
    this.capturedIds = new Set(capturedIds);
  }

  updateCaptured(capturedIds: string[]): void {
    this.capturedIds = new Set(capturedIds);
  }

  setAllowedCharacters(ids: string[]): void {
    this.allowedIds = new Set(ids);
  }

  checkEncounter(stepCount: number, playerTileX: number, playerTileY: number, excludeIds?: Set<string>): ClassicalCharacter | null {
    if (stepCount - this.lastCheckStep < ENCOUNTER_CHECK_STEPS) return null;
    this.lastCheckStep = stepCount;

    if (!randomChance(ENCOUNTER_CHANCE)) return null;

    // Filter to uncaptured characters in the allowed set, excluding visible ones on the map
    const candidates = this.characters.filter(
      c => !this.capturedIds.has(c.id) && this.allowedIds.has(c.id) && !excludeIds?.has(c.id)
    );

    if (candidates.length === 0) return null;

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  getRandomCharacter(): ClassicalCharacter | null {
    // Guardian encounters only use remaining uncaptured stage characters
    const stageCandidates = this.characters.filter(
      c => !this.capturedIds.has(c.id) && this.allowedIds.has(c.id)
    );
    if (stageCandidates.length === 0) return null;
    return stageCandidates[Math.floor(Math.random() * stageCandidates.length)];
  }
}
