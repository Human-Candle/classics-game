import type { Badge, BadgeCondition, ClassicalCharacter } from '../data/types';
import type { PlayerState } from '../utils/SaveManager';
import { badges } from '../data/badges';
import { items } from '../data/items';
import { weapons } from '../data/weapons';
import { levels, type LevelConfig } from '../data/levels';
import type { StageMapConfig } from '../data/stages';

export class ProgressionSystem {
  private allCharacters: ClassicalCharacter[];

  constructor(allCharacters: ClassicalCharacter[]) {
    this.allCharacters = allCharacters;
  }

  getCurrentLevel(state: PlayerState): LevelConfig {
    return levels.find(l => l.level === state.currentLevel) ?? levels[0];
  }

  checkLevelUp(state: PlayerState, stageConfig: StageMapConfig): LevelConfig | null {
    // Stage is complete when ALL stage characters are captured AND ALL stage locations are looted
    const allCharsCaptured = stageConfig.characterIds.every(id => state.capturedCharacters.includes(id));
    const allLocsLooted = stageConfig.locationIds.every(id => !!state.lootedLocations[id]);

    if (allCharsCaptured && allLocsLooted) {
      const nextLevel = levels.find(l => l.level === state.currentLevel + 1);
      if (nextLevel) {
        return nextLevel;
      }
    }
    return null;
  }

  checkNewBadges(state: PlayerState): Badge[] {
    const newBadges: Badge[] = [];
    for (const badge of badges) {
      if (state.badges.includes(badge.id)) continue;
      if (this.checkCondition(badge.condition, state)) {
        newBadges.push(badge);
      }
    }
    return newBadges;
  }

  private checkCondition(condition: BadgeCondition, state: PlayerState): boolean {
    switch (condition.type) {
      case 'capture_count': {
        let captured = state.capturedCharacters;
        if (condition.characterType) {
          const typeChars = this.allCharacters
            .filter(c => c.type === condition.characterType)
            .map(c => c.id);
          captured = captured.filter(id => typeChars.includes(id));
        }
        return captured.length >= condition.count;
      }
      case 'capture_specific':
        return condition.characterIds.every(id => state.capturedCharacters.includes(id));
      case 'collect_items': {
        let count = 0;
        for (const slot of state.inventory) {
          const item = items.find(i => i.id === slot.itemId);
          if (item && (!condition.itemType || item.type === condition.itemType)) {
            count += slot.quantity;
          }
        }
        return count >= condition.count;
      }
      case 'loot_locations':
        return Object.keys(state.lootedLocations).length >= condition.count;
      case 'gold_earned':
        return state.stats.totalGoldEarned >= condition.amount;
      case 'own_all_weapons':
        return weapons.every(w => state.ownedWeapons.includes(w.id));
      case 'battles_won_streak':
        // This is tracked via a runtime counter, not save state
        // We'll check it differently in the battle scene
        return false;
    }
  }
}
