import type { Skill, SkillEffect } from "../types/GameState";
import type { ElementType } from "./elements";

// Placeholder skill effects - to be implemented with each skill
const placeholderEffect: SkillEffect = (state, elementType) => {
  console.log(`Placeholder effect for ${elementType} skill`);
  return state;
};

// All skills in a flat array - skills can have multi-element requirements
export const allSkills: Skill[] = [
  // Basic elemental abilities - Free skills at level 5
  {
    id: "fire_burn",
    name: "Fire Burns",
    description: "Fire attacks apply burn damage over time to enemies",
    cost: 0,
    unlockRequirements: { fire: 5 },
    effect: placeholderEffect,
    icon: "1",
  },
  {
    id: "ice_slow",
    name: "Ice Freezes",
    description: "Ice attacks slow enemy movement speed",
    cost: 0,
    unlockRequirements: { ice: 5 },
    effect: placeholderEffect,
    icon: "1",
  },
  {
    id: "earth_splash",
    name: "Rocks Crash",
    description: "Earth attacks deal splash damage to nearby enemies",
    cost: 0,
    unlockRequirements: { earth: 5 },
    effect: placeholderEffect,
    icon: "1",
  },
  {
    id: "air_burst",
    name: "Wind Gusts",
    description: "Air defenders periodically fire multiple attacks at once",
    cost: 0,
    unlockRequirements: { air: 5 },
    effect: placeholderEffect,
    icon: "1",
  },

  // Advanced single-element skills
  {
    id: "fire_percentage_damage",
    name: "Percentage Health Damage",
    description: "Fire arrows do % enemy health damage on hit",
    cost: 30000,
    unlockRequirements: { fire: 15 },
    effect: placeholderEffect,
    icon: "2",
  },
  {
    id: "fire_burn_stacking",
    name: "Burn Stacking",
    description: "Fire arrows stack burn damage instead of refreshing duration",
    cost: 75000,
    unlockRequirements: { fire: 35 },
    effect: placeholderEffect,
    icon: "4",
  },
  {
    id: "fire_lightning_bolt",
    name: "Lightning Bolt",
    description: "Lightning bolt kills the highest HP enemy on the map",
    cost: 250000,
    unlockRequirements: { fire: 55 },
    effect: placeholderEffect,
    icon: "6",
  },
  {
    id: "fire_bonus_1",
    name: "Fire Power Upgrade",
    description: "[TBD - Fire Power Upgrade]",
    cost: 1000000,
    unlockRequirements: { fire: 75 },
    effect: placeholderEffect,
    icon: "8",
  },
  {
    id: "fire_bonus_2",
    name: "Ultimate Fire Ability",
    description: "[TBD - Ultimate Fire Ability]",
    cost: 2000000,
    unlockRequirements: { fire: 85 },
    effect: placeholderEffect,
    icon: "9",
  },

  {
    id: "ice_permafrost",
    name: "Permafrost",
    description: "On first hit from ice tower, freeze enemy for 1s",
    cost: 30000,
    unlockRequirements: { ice: 15 },
    effect: placeholderEffect,
    icon: "2",
  },
  {
    id: "ice_damage_upgrade",
    name: "Ice Damage Enhancement",
    description: "[TBD - Ice Damage Upgrade]",
    cost: 75000,
    unlockRequirements: { ice: 35 },
    effect: placeholderEffect,
    icon: "4",
  },
  {
    id: "ice_critical_vulnerability",
    name: "Critical Vulnerability",
    description: "Any hits on slowed enemies have increased crit chance",
    cost: 250000,
    unlockRequirements: { ice: 55 },
    effect: placeholderEffect,
    icon: "6",
  },
  {
    id: "ice_bonus_1",
    name: "Ice Power Upgrade",
    description: "[TBD - Ice Power Upgrade]",
    cost: 1000000,
    unlockRequirements: { ice: 75 },
    effect: placeholderEffect,
    icon: "8",
  },
  {
    id: "ice_bonus_2",
    name: "Ultimate Ice Ability",
    description: "[TBD - Ultimate Ice Ability]",
    cost: 2000000,
    unlockRequirements: { ice: 85 },
    effect: placeholderEffect,
    icon: "9",
  },

  {
    id: "earth_smart_targeting",
    name: "Smart Targeting",
    description: "Target highest enemy density for maximum splash",
    cost: 30000,
    unlockRequirements: { earth: 15 },
    effect: placeholderEffect,
    icon: "2",
  },
  {
    id: "earth_stone_skin",
    name: "Stone Skin",
    description: "Reduces all incoming damage to castle",
    cost: 75000,
    unlockRequirements: { earth: 35 },
    effect: placeholderEffect,
    icon: "4",
  },
  {
    id: "earth_earthquake",
    name: "Earthquake",
    description: "Hit all enemies on the map",
    cost: 250000,
    unlockRequirements: { earth: 55 },
    effect: placeholderEffect,
    icon: "6",
  },
  {
    id: "earth_fissure",
    name: "Fissure",
    description: "Damage all enemies in a horizontal line in front of the mage",
    cost: 1000000,
    unlockRequirements: { earth: 75 },
    effect: placeholderEffect,
    icon: "8",
  },
  {
    id: "earth_fragment_explosion",
    name: "Fragment Explosion",
    description: "Earth fragments explode again",
    cost: 2000000,
    unlockRequirements: { earth: 85 },
    effect: placeholderEffect,
    icon: "9",
  },

  {
    id: "air_critical_hit",
    name: "Critical Hit Chance",
    description: "% Critical hit chance for massive damage",
    cost: 30000,
    unlockRequirements: { air: 15 },
    effect: placeholderEffect,
    icon: "2",
  },
  {
    id: "air_double_attack_speed",
    name: "Double Attack Speed",
    description: "Double the attack speed of neighboring mages",
    cost: 75000,
    unlockRequirements: { air: 35 },
    effect: placeholderEffect,
    icon: "4",
  },
  {
    id: "air_smart_burst_targeting",
    name: "Smart Burst Targeting",
    description:
      "Burst arrows can target different enemies based on predicted damage",
    cost: 250000,
    unlockRequirements: { air: 55 },
    effect: placeholderEffect,
    icon: "6",
  },
  {
    id: "air_bonus_1",
    name: "Air Power Upgrade",
    description: "[TBD - Air Power Upgrade]",
    cost: 1000000,
    unlockRequirements: { air: 75 },
    effect: placeholderEffect,
    icon: "8",
  },
  {
    id: "air_bonus_2",
    name: "Ultimate Air Ability",
    description: "[TBD - Ultimate Air Ability]",
    cost: 2000000,
    unlockRequirements: { air: 85 },
    effect: placeholderEffect,
    icon: "9",
  },

  // Multi-element synergy skills (no duplicates!)
  {
    id: "freezeburn",
    name: "Freezeburn",
    description: "Frozen enemies take double burn damage",
    cost: 50000,
    unlockRequirements: { fire: 25, ice: 25 },
    effect: placeholderEffect,
    icon: "3",
  },
  {
    id: "firewave",
    name: "Firewave",
    description: "Sends out a semi-circle of fire arrows",
    cost: 100000,
    unlockRequirements: { fire: 45, air: 45 },
    effect: placeholderEffect,
    icon: "5",
  },
  {
    id: "disco_inferno",
    name: "Disco Inferno",
    description: "On death, burn spreads to nearby enemies",
    cost: 500000,
    unlockRequirements: { fire: 65, earth: 65 },
    effect: placeholderEffect,
    icon: "7",
  },
  {
    id: "blizzard",
    name: "Blizzard",
    description: "Ice circles appear on map that slow and damage enemies",
    cost: 100000,
    unlockRequirements: { ice: 45, earth: 45 },
    effect: placeholderEffect,
    icon: "5",
  },
  {
    id: "icy_wind",
    name: "Icy Wind",
    description: "Creates wind currents that slow all enemies on the map",
    cost: 500000,
    unlockRequirements: { ice: 65, air: 65 },
    effect: placeholderEffect,
    icon: "7",
  },
  {
    id: "vortex",
    name: "Vortex",
    description: "Pulls enemies into tighter groups",
    cost: 50000,
    unlockRequirements: { earth: 25, air: 25 },
    effect: placeholderEffect,
    icon: "3",
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
