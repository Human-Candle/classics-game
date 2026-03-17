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

    const numRolls = randomInt(1, 3);
    const lootedItems: { item: GameItem; quantity: number }[] = [];

    for (let i = 0; i < numRolls; i++) {
      const entry = weightedRandom(location.lootTable.map(e => ({
        ...e,
        weight: e.weight * weaponMultiplier,
      })));

      const item = items.find(it => it.id === entry.itemId);
      if (item) {
        const qty = randomInt(entry.quantity[0], entry.quantity[1]);
        const existing = lootedItems.find(l => l.item.id === item.id);
        if (existing) {
          existing.quantity += qty;
        } else {
          lootedItems.push({ item, quantity: qty });
        }
      }
    }

    const triggeredEncounter = randomChance(LOOT_ENCOUNTER_CHANCE);

    return { items: lootedItems, triggeredEncounter };
  }
}
