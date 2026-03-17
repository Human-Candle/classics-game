export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export interface PlayerState {
  position: { x: number; y: number };
  lives: number;
  maxLives: number;
  gold: number;
  capturedCharacters: string[];
  inventory: InventorySlot[];
  equippedWeapon: string | null;
  ownedWeapons: string[];
  badges: string[];
  revealedTiles: boolean[][];
  lootedLocations: Record<string, number>;
  defeatedBy: string[];
  stats: {
    totalGoldEarned: number;
    totalItemsSold: number;
    totalBattlesWon: number;
    totalBattlesLost: number;
  };
}

import { MAP_WIDTH, MAP_HEIGHT, STARTING_LIVES } from '../config';

const SAVE_KEY = 'classics-game-save';

export function createDefaultState(): PlayerState {
  const revealedTiles: boolean[][] = [];
  for (let x = 0; x < MAP_WIDTH; x++) {
    revealedTiles[x] = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
      revealedTiles[x][y] = false;
    }
  }

  return {
    position: { x: 10, y: 10 },
    lives: STARTING_LIVES,
    maxLives: STARTING_LIVES,
    gold: 0,
    capturedCharacters: [],
    inventory: [],
    equippedWeapon: null,
    ownedWeapons: [],
    badges: [],
    revealedTiles,
    lootedLocations: {},
    defeatedBy: [],
    stats: {
      totalGoldEarned: 0,
      totalItemsSold: 0,
      totalBattlesWon: 0,
      totalBattlesLost: 0,
    },
  };
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
    if (data) return JSON.parse(data) as PlayerState;
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
