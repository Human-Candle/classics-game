import type { Badge } from './types';

export const badges: Badge[] = [
  // Capture badges
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Capture 5 authors',
    condition: { type: 'capture_count', characterType: 'author', count: 5 },
  },
  {
    id: 'art-lover',
    name: 'Art Lover',
    description: 'Capture 5 artists',
    condition: { type: 'capture_count', characterType: 'artist', count: 5 },
  },
  {
    id: 'renaissance-person',
    name: 'Renaissance Person',
    description: 'Capture Da Vinci, Michelangelo, and Raphael',
    condition: { type: 'capture_specific', characterIds: ['da-vinci', 'michelangelo', 'raphael'] },
  },
  {
    id: 'ancient-wisdom',
    name: 'Ancient Wisdom',
    description: 'Capture Homer and Virgil',
    condition: { type: 'capture_specific', characterIds: ['homer', 'virgil'] },
  },
  {
    id: 'russian-soul',
    name: 'Russian Soul',
    description: 'Capture Dostoevsky and Tolstoy',
    condition: { type: 'capture_specific', characterIds: ['dostoevsky', 'tolstoy'] },
  },
  {
    id: 'modernist',
    name: 'Modernist',
    description: 'Capture Woolf, Kafka, and Joyce',
    condition: { type: 'capture_specific', characterIds: ['woolf', 'kafka', 'joyce'] },
  },
  {
    id: 'dutch-masters',
    name: 'Dutch Masters',
    description: 'Capture Rembrandt and Vermeer',
    condition: { type: 'capture_specific', characterIds: ['rembrandt', 'vermeer'] },
  },
  {
    id: 'gotta-read-em-all',
    name: "Gotta Read 'Em All",
    description: 'Capture every author',
    condition: { type: 'capture_count', characterType: 'author', count: 18 },
  },
  {
    id: 'gallery-complete',
    name: 'Gallery Complete',
    description: 'Capture every artist',
    condition: { type: 'capture_count', characterType: 'artist', count: 18 },
  },
  {
    id: 'master-collector',
    name: 'Master Collector',
    description: 'Capture every character',
    condition: { type: 'capture_count', count: 36 },
  },
  // Loot badges
  {
    id: 'bibliophile',
    name: 'Bibliophile',
    description: 'Collect 10 books',
    condition: { type: 'collect_items', itemType: 'book', count: 10 },
  },
  {
    id: 'curator',
    name: 'Curator',
    description: 'Collect 10 artworks',
    condition: { type: 'collect_items', itemType: 'artwork', count: 10 },
  },
  {
    id: 'treasure-hunter',
    name: 'Treasure Hunter',
    description: 'Loot every location at least once',
    condition: { type: 'loot_locations', count: 7 },
  },
  // Economy badges
  {
    id: 'black-market-mogul',
    name: 'Black Market Mogul',
    description: 'Earn 1000 gold total',
    condition: { type: 'gold_earned', amount: 1000 },
  },
  {
    id: 'fully-armed',
    name: 'Fully Armed',
    description: 'Own all weapons',
    condition: { type: 'own_all_weapons' },
  },
  // Survival badges
  {
    id: 'untouchable',
    name: 'Untouchable',
    description: 'Win 5 battles in a row without losing',
    condition: { type: 'battles_won_streak', count: 5 },
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return badges.find(b => b.id === id);
}
