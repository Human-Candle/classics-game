export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export interface PlayerState {
  position: { x: number; y: number };
  lives: number;
  maxLives: number;
  gold: number;
  currentLevel: number;
  capturedCharacters: string[];
  inventory: InventorySlot[];
  equippedWeapon: string | null;
  ownedWeapons: string[];
  badges: string[];
  revealedTiles: Record<number, boolean[][]>;
  lootedLocations: Record<string, number>;
  defeatedBy: string[];
  grottoReadStages: number[];
  stats: {
    totalGoldEarned: number;
    totalItemsSold: number;
    totalBattlesWon: number;
    totalBattlesLost: number;
  };
}

import { STARTING_LIVES } from '../config';
import { getLevelForCaptures } from '../data/levels';

const SAVE_KEY = 'classics-game-save';

export function createDefaultState(): PlayerState {
  return {
    position: { x: 5, y: 5 },
    lives: STARTING_LIVES,
    maxLives: STARTING_LIVES,
    gold: 0,
    currentLevel: 1,
    capturedCharacters: [],
    inventory: [],
    equippedWeapon: null,
    ownedWeapons: [],
    badges: [],
    revealedTiles: {},
    lootedLocations: {},
    defeatedBy: [],
    grottoReadStages: [],
    stats: {
      totalGoldEarned: 0,
      totalItemsSold: 0,
      totalBattlesWon: 0,
      totalBattlesLost: 0,
    },
  };
}

export function getOrCreateRevealedTiles(
  state: PlayerState, stage: number, width: number, height: number
): boolean[][] {
  if (!state.revealedTiles[stage]) {
    const tiles: boolean[][] = [];
    for (let x = 0; x < width; x++) {
      tiles[x] = new Array(height).fill(false);
    }
    state.revealedTiles[stage] = tiles;
  }
  return state.revealedTiles[stage];
}

export function saveGame(state: PlayerState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function loadGame(): PlayerState | null {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
      const state = JSON.parse(data) as PlayerState;
      // Migrate saves from before level system
      if (state.currentLevel === undefined) {
        state.currentLevel = getLevelForCaptures(state.capturedCharacters.length).level;
      }
      // Migrate old flat revealedTiles array to per-stage Record
      if (Array.isArray(state.revealedTiles)) {
        const oldTiles = state.revealedTiles as unknown as boolean[][];
        (state as PlayerState).revealedTiles = { [state.currentLevel]: oldTiles };
      }
      return state;
    }
  } catch {
    // corrupted save
  }
  return null;
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
