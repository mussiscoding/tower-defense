import type { ShopItem } from "../types/GameState";
import type { GameState } from "../types/GameState";

export interface UpgradeEffect {
  (state: GameState): GameState;
}

export interface UpgradeShopItem extends ShopItem {
  effect: UpgradeEffect;
}

export const upgradeShopItems: UpgradeShopItem[] = [
  // Fire element ability upgrades
  {
    id: "fire_burn_damage_upgrade",
    name: "Burn Damage",
    description: "Increase burn damage +1",
    cost: 200,
    type: "upgrade",
    scalingFactor: 1.15,
    effect: (state: GameState) => {
      const currentUpgrades = state.purchases["fire_burn_damage_upgrade"] || 0;
      const newUpgrades = currentUpgrades + 1;

      return {
        ...state,
        purchases: {
          ...state.purchases,
          fire_burn_damage_upgrade: newUpgrades,
        },
      };
    },
  },
  {
    id: "fire_burn_duration_upgrade",
    name: "Burn Duration",
    description: "Increase burn duration +1s",
    cost: 300,
    type: "upgrade",
    scalingFactor: 1.2,
    effect: (state: GameState) => {
      const currentUpgrades =
        state.purchases["fire_burn_duration_upgrade"] || 0;
      const newUpgrades = currentUpgrades + 1;
      return {
        ...state,
        purchases: {
          ...state.purchases,
          fire_burn_duration_upgrade: newUpgrades,
        },
      };
    },
  },
  // Ice element ability upgrades
  {
    id: "ice_slow_effect_upgrade",
    name: "Slow Effect",
    description: "Increase slow effect +1%",
    cost: 200,
    type: "upgrade",
    scalingFactor: 1.15,
    effect: (state: GameState) => {
      const currentUpgrades = state.purchases["ice_slow_effect_upgrade"] || 0;
      const newUpgrades = currentUpgrades + 1;

      return {
        ...state,
        purchases: {
          ...state.purchases,
          ice_slow_effect_upgrade: newUpgrades,
        },
      };
    },
  },
  {
    id: "ice_slow_duration_upgrade",
    name: "Slow Duration",
    description: "Increase slow duration +1s",
    cost: 300,
    type: "upgrade",
    scalingFactor: 1.2,
    effect: (state: GameState) => {
      const currentUpgrades = state.purchases["ice_slow_duration_upgrade"] || 0;
      const newUpgrades = currentUpgrades + 1;

      return {
        ...state,
        purchases: {
          ...state.purchases,
          ice_slow_duration_upgrade: newUpgrades,
        },
      };
    },
  },
];
