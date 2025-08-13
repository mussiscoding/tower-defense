import type { Skill } from "../types/GameState";
import type { ElementType } from "./elements";
import { allUpgrades } from "./upgrades";

import {
  fireBurnOnHit,
  iceSlowOnHit,
  earthSplashOnHit,
  airBurstOnAttack,
} from "./skillEffects";

// Helper function to get upgrade amount for a specific upgrade
const getUpgradeAmount = (upgradeId: string): number => {
  const upgrade = allUpgrades.find((item) => item.id === upgradeId);
  return upgrade?.upgradeAmount || 1; // fallback to 1 if not found
};

export const allSkills: Skill[] = [
  {
    id: "fire_burn",
    name: "Fire Burns",
    description: "Fire attacks apply burn damage over time to enemies",
    cost: 0,
    unlockRequirements: { fire: 5 },
    icon: "1",
    category: "attack_modifier",
    statName: "Burn Damage",
    statValue: (purchases: Record<string, number>) => {
      const basePercent = 20;
      const upgrades = purchases["fire_burn_damage_upgrade"] || 0;
      const upgradeAmount = getUpgradeAmount("fire_burn_damage_upgrade");
      return `${basePercent + upgrades * upgradeAmount}%`;
    },
    onHit: fireBurnOnHit,
  },
  {
    id: "ice_slow",
    name: "Ice Freezes",
    description: "Ice attacks slow enemy movement speed",
    cost: 0,
    unlockRequirements: { ice: 5 },
    icon: "1",
    category: "attack_modifier",
    statName: "Slow Effect",
    statValue: (purchases: Record<string, number>) => {
      const basePercent = 5;
      const upgrades = purchases["ice_slow_effect_upgrade"] || 0;
      const upgradeAmount = getUpgradeAmount("ice_slow_effect_upgrade");
      return `${basePercent + upgrades * upgradeAmount}%`;
    },
    onHit: iceSlowOnHit,
  },
  {
    id: "earth_splash",
    name: "Rocks Crash",
    description: "Earth attacks deal splash damage to nearby enemies",
    cost: 0,
    unlockRequirements: { earth: 5 },
    icon: "1",
    category: "attack_modifier",
    statName: "Splash Damage",
    statValue: (purchases: Record<string, number>) => {
      const basePercent = 20;
      const upgrades = purchases["earth_splash_damage_upgrade"] || 0;
      const upgradeAmount = getUpgradeAmount("earth_splash_damage_upgrade");
      return `${Math.min(100, basePercent + upgrades * upgradeAmount)}%`;
    },
    onHit: earthSplashOnHit,
  },
  {
    id: "air_burst",
    name: "Wind Gusts",
    description: "Air defenders periodically fire multiple attacks at once",
    cost: 0,
    unlockRequirements: { air: 5 },
    icon: "1",
    category: "active",
    priority: 1,
    cooldown: 8000,
    statName: "Burst Shots",
    statValue: (purchases: Record<string, number>) => {
      const baseShots = 2;
      const upgrades = purchases["air_burst_shots_upgrade"] || 0;
      const upgradeAmount = getUpgradeAmount("air_burst_shots_upgrade");
      return `${baseShots + upgrades * upgradeAmount}`;
    },
    onAttack: airBurstOnAttack,
  },

  {
    id: "fire_percentage_damage",
    name: "Percentage Health Damage",
    description: "Fire arrows do % enemy health damage on hit",
    cost: 30000,
    unlockRequirements: { fire: 15 },
    icon: "2",
    category: "attack_modifier",
    statName: "% Health Damage",
    statValue: "5%", // Static value example
  },
  {
    id: "fire_burn_stacking",
    name: "Burn Stacking",
    description: "Fire arrows stack burn damage instead of refreshing duration",
    cost: 75000,
    unlockRequirements: { fire: 35 },

    icon: "4",
    category: "attack_modifier",
  },
  {
    id: "fire_lightning_bolt",
    name: "Lightning Bolt",
    description: "Lightning bolt kills the highest HP enemy on the map",
    cost: 250000,
    unlockRequirements: { fire: 55 },

    icon: "6",
    category: "attack_modifier",
  },
  {
    id: "fire_bonus_1",
    name: "Fire Power Upgrade",
    description: "[TBD - Fire Power Upgrade]",
    cost: 1000000,
    unlockRequirements: { fire: 75 },

    icon: "8",
    category: "attack_modifier",
  },
  {
    id: "fire_bonus_2",
    name: "Ultimate Fire Ability",
    description: "[TBD - Ultimate Fire Ability]",
    cost: 2000000,
    unlockRequirements: { fire: 85 },

    icon: "9",
    category: "attack_modifier",
  },

  {
    id: "ice_permafrost",
    name: "Permafrost",
    description: "On first hit from ice tower, freeze enemy for 1s",
    cost: 30000,
    unlockRequirements: { ice: 15 },

    icon: "2",
    category: "attack_modifier",
  },
  {
    id: "ice_damage_upgrade",
    name: "Ice Damage Enhancement",
    description: "[TBD - Ice Damage Upgrade]",
    cost: 75000,
    unlockRequirements: { ice: 35 },

    icon: "4",
    category: "attack_modifier",
  },
  {
    id: "ice_critical_vulnerability",
    name: "Critical Vulnerability",
    description: "Any hits on slowed enemies have increased crit chance",
    cost: 250000,
    unlockRequirements: { ice: 55 },

    icon: "6",
    category: "attack_modifier",
  },
  {
    id: "ice_bonus_1",
    name: "Ice Power Upgrade",
    description: "[TBD - Ice Power Upgrade]",
    cost: 1000000,
    unlockRequirements: { ice: 75 },

    icon: "8",
    category: "attack_modifier",
  },
  {
    id: "ice_bonus_2",
    name: "Ultimate Ice Ability",
    description: "[TBD - Ultimate Ice Ability]",
    cost: 2000000,
    unlockRequirements: { ice: 85 },

    icon: "9",
    category: "attack_modifier",
  },

  {
    id: "earth_smart_targeting",
    name: "Smart Targeting",
    description: "Target highest enemy density for maximum splash",
    cost: 30000,
    unlockRequirements: { earth: 15 },

    icon: "2",
    category: "attack_modifier",
  },
  {
    id: "earth_stone_skin",
    name: "Stone Skin",
    description: "Reduces all incoming damage to castle",
    cost: 75000,
    unlockRequirements: { earth: 35 },

    icon: "4",
    category: "attack_modifier",
  },
  {
    id: "earth_earthquake",
    name: "Earthquake",
    description: "Hit all enemies on the map",
    cost: 250000,
    unlockRequirements: { earth: 55 },

    icon: "6",
    category: "attack_modifier",
  },
  {
    id: "earth_fissure",
    name: "Fissure",
    description: "Damage all enemies in a horizontal line in front of the mage",
    cost: 1000000,
    unlockRequirements: { earth: 75 },

    icon: "8",
    category: "attack_modifier",
  },
  {
    id: "earth_fragment_explosion",
    name: "Fragment Explosion",
    description: "Earth fragments explode again",
    cost: 2000000,
    unlockRequirements: { earth: 85 },

    icon: "9",
    category: "attack_modifier",
  },

  {
    id: "air_critical_hit",
    name: "Critical Hit Chance",
    description: "% Critical hit chance for massive damage",
    cost: 30000,
    unlockRequirements: { air: 15 },
    icon: "2",
    category: "attack_modifier",
    statName: "Crit Chance",
    statValue: (purchases: Record<string, number>) => {
      const baseCrit = 10;
      const upgrades = purchases["air_critical_hit_upgrade"] || 0;
      return `${baseCrit + upgrades}%`;
    },
  },
  {
    id: "air_double_attack_speed",
    name: "Double Attack Speed",
    description: "Double the attack speed of neighboring mages",
    cost: 75000,
    unlockRequirements: { air: 35 },

    icon: "4",
    category: "attack_modifier",
  },
  {
    id: "air_smart_burst_targeting",
    name: "Smart Burst Targeting",
    description:
      "Burst arrows can target different enemies based on predicted damage",
    cost: 250000,
    unlockRequirements: { air: 55 },

    icon: "6",
    category: "attack_modifier",
  },
  {
    id: "air_bonus_1",
    name: "Air Power Upgrade",
    description: "[TBD - Air Power Upgrade]",
    cost: 1000000,
    unlockRequirements: { air: 75 },

    icon: "8",
    category: "attack_modifier",
  },
  {
    id: "air_bonus_2",
    name: "Ultimate Air Ability",
    description: "[TBD - Ultimate Air Ability]",
    cost: 2000000,
    unlockRequirements: { air: 85 },

    icon: "9",
    category: "attack_modifier",
  },

  // Multi-element synergy skills (no duplicates!)
  {
    id: "freezeburn",
    name: "Freezeburn",
    description: "Frozen enemies take double burn damage",
    cost: 50000,
    unlockRequirements: { fire: 25, ice: 25 },

    icon: "3",
    category: "attack_modifier",
  },
  {
    id: "firewave",
    name: "Firewave",
    description: "Sends out a semi-circle of fire arrows",
    cost: 100000,
    unlockRequirements: { fire: 45, air: 45 },

    icon: "5",
    category: "attack_modifier",
  },
  {
    id: "disco_inferno",
    name: "Disco Inferno",
    description: "On death, burn spreads to nearby enemies",
    cost: 500000,
    unlockRequirements: { fire: 65, earth: 65 },
    icon: "7",
    category: "attack_modifier",
    statName: "Spread Radius",
    statValue: "100px", // Multi-element skill example
  },
  {
    id: "blizzard",
    name: "Blizzard",
    description: "Ice circles appear on map that slow and damage enemies",
    cost: 100000,
    unlockRequirements: { ice: 45, earth: 45 },

    icon: "5",
    category: "attack_modifier",
  },
  {
    id: "icy_wind",
    name: "Icy Wind",
    description: "Creates wind currents that slow all enemies on the map",
    cost: 500000,
    unlockRequirements: { ice: 65, air: 65 },

    icon: "7",
    category: "attack_modifier",
  },
  {
    id: "vortex",
    name: "Vortex",
    description: "Pulls enemies into tighter groups",
    cost: 50000,
    unlockRequirements: { earth: 25, air: 25 },

    icon: "3",
    category: "attack_modifier",
  },
];

// Helper functions for working with skills
export const getSkillsForElement = (elementType: ElementType): Skill[] => {
  return allSkills.filter(
    (skill) => skill.unlockRequirements[elementType] !== undefined
  );
};

export const getSkillById = (skillId: string): Skill | undefined => {
  return allSkills.find((skill) => skill.id === skillId);
};

export const getAllSkills = (): Skill[] => {
  return allSkills;
};

export const getSynergySkills = (): Skill[] => {
  return allSkills.filter(
    (skill) => Object.keys(skill.unlockRequirements).length > 1
  );
};

export const getSingleElementSkills = (): Skill[] => {
  return allSkills.filter(
    (skill) => Object.keys(skill.unlockRequirements).length === 1
  );
};
