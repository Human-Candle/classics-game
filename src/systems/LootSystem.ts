import type { LootableLocation, GameItem } from '../data/types';
import { items } from '../data/items';
import { getWeaponTier } from '../data/weapons';
import { weightedRandom, randomInt, randomChance } from '../utils/RandomUtils';
import { LOOT_ENCOUNTER_CHANCE } from '../config';

export interface LootResult {
  items: { item: GameItem; quantity: number }[];
  triggeredEncounter: boolean;
}

export class LootSystem {
  loot(location: LootableLocation, equippedWeapon: string | null, weaponMultiplier: number): LootResult {
    const tier = getWeaponTier(equippedWeapon);
    if (tier < location.requiredWeaponTier) {
      return { items: [], triggeredEncounter: false };
    }

    // Filter to loot table entries that have valid items
    const validEntries = location.lootTable
      .map(e => ({ ...e, weight: e.weight * weaponMultiplier }))
      .filter(e => items.some(it => it.id === e.itemId));

    if (validEntries.length === 0) {
      return { items: [], triggeredEncounter: false };
    }

    const numRolls = randomInt(1, 3);
    const lootedItems: { item: GameItem; quantity: number }[] = [];

    for (let i = 0; i < numRolls; i++) {
      const entry = weightedRandom(validEntries);
      const item = items.find(it => it.id === entry.itemId)!;
      const qty = Math.max(1, randomInt(entry.quantity[0], entry.quantity[1]));
      const existing = lootedItems.find(l => l.item.id === item.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        lootedItems.push({ item, quantity: qty });
      }
    }

    // Guarantee at least one item
    if (lootedItems.length === 0) {
      const entry = weightedRandom(validEntries);
      const item = items.find(it => it.id === entry.itemId)!;
      lootedItems.push({ item, quantity: 1 });
    }

    const triggeredEncounter = randomChance(LOOT_ENCOUNTER_CHANCE);

    return { items: lootedItems, triggeredEncounter };
  }
}
