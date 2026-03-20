import Phaser from 'phaser';
import { ShopUI } from '../ui/ShopUI';
import { weapons, healthUpgrades, getWeaponById } from '../data/weapons';
import { items as allItems } from '../data/items';
import { EconomySystem } from '../systems/EconomySystem';
import { HealthSystem } from '../systems/HealthSystem';
import { MAX_LIVES_CAP } from '../config';
import type { PlayerState } from '../utils/SaveManager';
import type { ShopItem } from '../ui/ShopUI';

export class ShopScene extends Phaser.Scene {
  private shopUI!: ShopUI;
  private economySystem = new EconomySystem();
  private healthSystem = new HealthSystem();

  constructor() {
    super({ key: 'ShopScene' });
  }

  create(data: { shopType: string; state: PlayerState; onStateUpdate: (s: PlayerState) => void }): void {
    const { shopType, state, onStateUpdate } = data;
    this.shopUI = new ShopUI(this);

    switch (shopType) {
      case 'blackmarket':
        this.showBlackMarket(state, onStateUpdate);
        break;
      case 'apothecary':
        this.showApothecary(state, onStateUpdate);
        break;
      case 'blacksmith':
        this.showBlacksmith(state, onStateUpdate);
        break;
    }
  }

  private showBlackMarket(state: PlayerState, onUpdate: (s: PlayerState) => void): void {
    const sellItems: ShopItem[] = state.inventory.map(slot => {
      const item = allItems.find(i => i.id === slot.itemId);
      if (!item) return null;
      const price = this.economySystem.getSellPrice(item);
      return {
        id: slot.itemId,
        name: `${item.name} (x${slot.quantity})`,
        description: `${item.description} [${item.rarity}]`,
        price,
        canAfford: true, // Always can sell
      };
    }).filter(Boolean) as ShopItem[];

    if (sellItems.length === 0) {
      sellItems.push({
        id: 'empty',
        name: 'Nothing to sell',
        description: 'Go loot some locations first!',
        price: 0,
        canAfford: false,
      });
    }

    this.shopUI.show('The Black Market', sellItems, state.gold, (id) => {
      if (id === 'empty') return;
      const slot = state.inventory.find(s => s.itemId === id);
      if (!slot) return;

      const item = allItems.find(i => i.id === id);
      if (!item) return;

      const price = this.economySystem.getSellPrice(item);
      slot.quantity--;
      if (slot.quantity <= 0) {
        state.inventory = state.inventory.filter(s => s.itemId !== id);
      }
      state.gold += price;
      state.stats.totalGoldEarned += price;
      state.stats.totalItemsSold++;

      onUpdate(state);
      // Refresh the shop
      this.scene.restart({ shopType: 'blackmarket', state, onStateUpdate: onUpdate });
    }, () => this.closeShop(), 'sell');
  }

  private showApothecary(state: PlayerState, onUpdate: (s: PlayerState) => void): void {
    const shopItems: ShopItem[] = healthUpgrades.map(h => {
      const atMaxLives = h.maxLifeIncrease > 0 && state.maxLives >= MAX_LIVES_CAP;
      const livesFull = h.maxLifeIncrease === 0 && state.lives >= state.maxLives;
      const unavailable = atMaxLives || livesFull;
      return {
        id: h.id,
        name: h.name,
        description: h.description + (h.maxLifeIncrease > 0 ? ` (+${h.maxLifeIncrease} max life)` : ` (+${h.livesRestored} life)`),
        price: h.price,
        canAfford: state.gold >= h.price && !unavailable,
        owned: unavailable,
        ownedLabel: atMaxLives ? 'MAX' : livesFull ? 'FULL' : undefined,
      };
    });

    this.shopUI.show('The Apothecary', shopItems, state.gold, (id) => {
      const upgrade = healthUpgrades.find(h => h.id === id);
      if (!upgrade || state.gold < upgrade.price) return;
      if (upgrade.maxLifeIncrease > 0 && state.maxLives >= MAX_LIVES_CAP) return;
      if (upgrade.maxLifeIncrease === 0 && state.lives >= state.maxLives) return;

      state.gold -= upgrade.price;
      this.healthSystem.restoreLives(state, upgrade.livesRestored);
      if (upgrade.maxLifeIncrease > 0) {
        this.healthSystem.increaseMaxLives(state, upgrade.maxLifeIncrease);
      }

      onUpdate(state);
      this.scene.restart({ shopType: 'apothecary', state, onStateUpdate: onUpdate });
    }, () => this.closeShop());
  }

  private showBlacksmith(state: PlayerState, onUpdate: (s: PlayerState) => void): void {
    const shopItems: ShopItem[] = weapons.map(w => ({
      id: w.id,
      name: w.name + (w.lootBonusMultiplier > 1 ? ` (+${Math.round((w.lootBonusMultiplier - 1) * 100)}% loot)` : ''),
      description: w.description + ` [Tier ${w.tier}]`,
      price: w.price,
      canAfford: state.gold >= w.price,
      owned: state.ownedWeapons.includes(w.id),
    }));

    this.shopUI.show('The Blacksmith', shopItems, state.gold, (id) => {
      const weapon = weapons.find(w => w.id === id);
      if (!weapon || state.gold < weapon.price || state.ownedWeapons.includes(id)) return;

      state.gold -= weapon.price;
      state.ownedWeapons.push(id);
      // Auto-equip if better than current
      const currentTier = state.equippedWeapon ? (getWeaponById(state.equippedWeapon)?.tier ?? 0) : 0;
      if (weapon.tier > currentTier) {
        state.equippedWeapon = id;
      }

      onUpdate(state);
      this.scene.restart({ shopType: 'blacksmith', state, onStateUpdate: onUpdate });
    }, () => this.closeShop());
  }

  private closeShop(): void {
    const worldScene = this.scene.get('WorldScene');
    worldScene.events.emit('shop-closed');
    this.scene.stop();
    this.scene.resume('WorldScene');
  }
}
