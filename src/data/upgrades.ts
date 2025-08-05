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
    description: "Increase burn damage +1% of tower damage",
    cost: 1000,
    type: "upgrade",
    costScalingFactor: 2.0,
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
  // Ice element ability upgrades
  {
    id: "ice_slow_effect_upgrade",
    name: "Slow Effect",
    description: "Increase slow effect +1%",
    cost: 1000,
    type: "upgrade",
    costScalingFactor: 2.0,
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
  // Earth element ability upgrades
  {
    id: "earth_splash_damage_upgrade",
    name: "Splash Damage",
    description: "Increase splash damage +1%",
    cost: 1000,
    type: "upgrade",
    costScalingFactor: 2.0,
    effect: (state: GameState) => {
      const currentUpgrades =
        state.purchases["earth_splash_damage_upgrade"] || 0;
      const newUpgrades = currentUpgrades + 1;

      return {
        ...state,
        purchases: {
          ...state.purchases,
          earth_splash_damage_upgrade: newUpgrades,
        },
      };
    },
  },
  {
    id: "earth_splash_radius_upgrade",
    name: "Splash Radius",
    description: "Increase splash radius +10",
    cost: 10000,
    type: "upgrade",
    costScalingFactor: 2.0,
    effect: (state: GameState) => {
      const currentUpgrades =
        state.purchases["earth_splash_radius_upgrade"] || 0;
      const newUpgrades = currentUpgrades + 1;

      return {
        ...state,
        purchases: {
          ...state.purchases,
          earth_splash_radius_upgrade: newUpgrades,
        },
      };
    },
  },
  // Air element ability upgrades
  {
    id: "air_burst_shots_upgrade",
    name: "Burst Shots",
    description: "Increase burst shots +1",
    cost: 1000,
    type: "upgrade",
    costScalingFactor: 2.0,
    effect: (state: GameState) => {
      const currentUpgrades = state.purchases["air_burst_shots_upgrade"] || 0;
      const newUpgrades = currentUpgrades + 1;

      return {
        ...state,
        purchases: {
          ...state.purchases,
          air_burst_shots_upgrade: newUpgrades,
        },
      };
    },
  },
  {
    id: "air_burst_cooldown_upgrade",
    name: "Burst Cooldown",
    description: "Reduce burst cooldown -1s",
    cost: 10000,
    type: "upgrade",
    costScalingFactor: 2.0,
    effect: (state: GameState) => {
      const currentUpgrades =
        state.purchases["air_burst_cooldown_upgrade"] || 0;
      const newUpgrades = currentUpgrades + 1;

      return {
        ...state,
        purchases: {
          ...state.purchases,
          air_burst_cooldown_upgrade: newUpgrades,
        },
      };
    },
  },
];
