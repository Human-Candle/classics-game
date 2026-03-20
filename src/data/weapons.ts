import type { Weapon, HealthUpgrade } from './types';

export const weapons: Weapon[] = [
  {
    id: 'rusty-crowbar',
    name: 'Rusty Crowbar',
    description: 'A bent iron bar. Gets the job done, barely.',
    tier: 1,
    lootBonusMultiplier: 1.0,
    price: 30,
  },
  {
    id: 'scholars-key',
    name: "Scholar's Key",
    description: 'A master key forged by a disgraced locksmith. Opens most doors.',
    tier: 2,
    lootBonusMultiplier: 1.15,
    price: 120,
  },
  {
    id: 'master-thief-kit',
    name: 'Master Thief Kit',
    description: 'A complete set of tools for the discerning art liberator.',
    tier: 3,
    lootBonusMultiplier: 1.3,
    price: 300,
  },
];

export const healthUpgrades: HealthUpgrade[] = [
  {
    id: 'healing-tonic',
    name: 'Healing Tonic',
    description: 'A bitter herbal remedy. Restores one life.',
    livesRestored: 1,
    maxLifeIncrease: 0,
    price: 50,
  },
  {
    id: 'ambrosia',
    name: 'Ambrosia',
    description: 'Food of the gods. Restores two lives.',
    livesRestored: 2,
    maxLifeIncrease: 0,
    price: 85,
  },
  {
    id: 'heart-container',
    name: 'Heart Container',
    description: 'A mysterious artifact that permanently increases your vitality.',
    livesRestored: 1,
    maxLifeIncrease: 1,
    price: 400,
  },
];

export function getWeaponById(id: string): Weapon | undefined {
  return weapons.find(w => w.id === id);
}

export function getWeaponTier(weaponId: string | null): number {
  if (!weaponId) return 0;
  return getWeaponById(weaponId)?.tier ?? 0;
}
