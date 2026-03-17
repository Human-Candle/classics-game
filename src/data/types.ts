export type CharacterType = 'author' | 'artist';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type LocationType = 'monastery' | 'library' | 'gallery' | 'collector';

export interface TriviaQuestion {
  question: string;
  answers: string[];
  correctIndex: number;
  funFact: string;
}

export interface ClassicalCharacter {
  id: string;
  name: string;
  type: CharacterType;
  gender: 'male' | 'female';
  birthYear: number;
  deathYear: number;
  nationality: string;
  bio: string;
  difficulty: Difficulty;
  questions: TriviaQuestion[];
  notableWorks: string[];
  famousExcerpts?: { work: string; excerpt: string }[];
}

export interface LootableLocation {
  id: string;
  name: string;
  type: LocationType;
  yearFounded: number;
  yearClosed: number | null;
  historicalNote: string;
  position: { x: number; y: number };
  lootTable: LootEntry[];
  requiredWeaponTier: number;
}

export interface LootEntry {
  itemId: string;
  weight: number;
  quantity: [number, number];
}

export interface GameItem {
  id: string;
  name: string;
  type: 'book' | 'artwork';
  creatorId: string;
  year: number;
  description: string;
  rarity: ItemRarity;
  baseValue: number;
}

export interface Weapon {
  id: string;
  name: string;
  description: string;
  tier: number;
  lootBonusMultiplier: number;
  price: number;
}

export interface HealthUpgrade {
  id: string;
  name: string;
  description: string;
  livesRestored: number;
  maxLifeIncrease: number;
  price: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  condition: BadgeCondition;
}

export type BadgeCondition =
  | { type: 'capture_count'; characterType?: CharacterType; count: number }
  | { type: 'capture_specific'; characterIds: string[] }
  | { type: 'collect_items'; itemType?: 'book' | 'artwork'; count: number }
  | { type: 'loot_locations'; count: number }
  | { type: 'gold_earned'; amount: number }
  | { type: 'own_all_weapons' }
  | { type: 'battles_won_streak'; count: number };
