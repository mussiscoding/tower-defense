import type { ShopItem } from "../types/GameState";
import type { GameState } from "../types/GameState";

export interface UpgradeEffect {
  (state: GameState): GameState;
}

export interface UpgradeShopItem extends ShopItem {
  effect: UpgradeEffect;
  prerequisiteSkill?: string; // ID of the skill that must be purchased first
  upgradeAmount?: number;
}

// Helper function to create upgrades with dynamic descriptions
const createUpgrade = (config: {
  id: string;
  name: string;
  upgradeAmount: number;
  cost: number;
  prerequisiteSkill: string;
  costScalingFactor?: number;
  unit?: string; // e.g., "%", "shots", "s", "radius"
  descriptionSuffix?: string; // custom description ending
}): UpgradeShopItem => ({
  id: config.id,
  name: config.name,
  description: `Increase ${config.name.toLowerCase()} +${config.upgradeAmount}${
    config.unit || "%"
  }${config.descriptionSuffix || ""}`,
  shortName: `+${config.upgradeAmount}${config.unit || "%"}`,
  cost: config.cost,
  type: "upgrade",
  costScalingFactor: config.costScalingFactor || 2.0,
  prerequisiteSkill: config.prerequisiteSkill,
  upgradeAmount: config.upgradeAmount,
  effect: (state: GameState) => {
    const currentUpgrades = state.purchases[config.id] || 0;
    return {
      ...state,
      purchases: {
        ...state.purchases,
        [config.id]: currentUpgrades + 1,
      },
    };
  },
});

export const allUpgrades: UpgradeShopItem[] = [
  // Fire element ability upgrades
  createUpgrade({
    id: "fire_burn_damage_upgrade",
    name: "Burn Damage",
    upgradeAmount: 1,
    cost: 1000,
    prerequisiteSkill: "fire_burn",
    descriptionSuffix: " of tower damage",
  }),
  createUpgrade({
    id: "fire_percentage_damage_upgrade",
    name: "Percentage Health Damage",
    upgradeAmount: 5,
    cost: 5000,
    prerequisiteSkill: "fire_percentage_damage",
  }),
  // Ice element ability upgrades
  createUpgrade({
    id: "ice_slow_effect_upgrade",
    name: "Slow Effect",
    upgradeAmount: 1,
    cost: 1000,
    prerequisiteSkill: "ice_slow",
  }),
  // Earth element ability upgrades
  createUpgrade({
    id: "earth_splash_damage_upgrade",
    name: "Splash Damage",
    upgradeAmount: 5,
    cost: 1000,
    prerequisiteSkill: "earth_splash",
  }),

  createUpgrade({
    id: "earth_splash_radius_upgrade",
    name: "Splash Radius",
    upgradeAmount: 10,
    cost: 10000,
    prerequisiteSkill: "earth_splash",
    unit: "",
    descriptionSuffix: " radius",
  }),
  // Air element ability upgrades
  createUpgrade({
    id: "air_burst_shots_upgrade",
    name: "Burst Shots",
    upgradeAmount: 1,
    cost: 1000,
    prerequisiteSkill: "air_burst",
    unit: "",
    descriptionSuffix: " shot",
  }),

  createUpgrade({
    id: "air_burst_cooldown_upgrade",
    name: "Burst Cooldown",
    upgradeAmount: 1,
    cost: 10000,
    prerequisiteSkill: "air_burst",
    unit: "s",
    descriptionSuffix: " cooldown reduction",
  }),
];
