import type {
  Skill,
  Enemy,
  Defender,
  SkillContext,
  SkillCategory,
} from "../types/GameState";

import { calculateSkillValue } from "../utils/skills";
import {
  fireBurnOnHit,
  iceSlowOnHit,
  earthSplashOnHit,
  airBurstOnAttack,
  firePercentageDamageOnHit,
  fireLightningBoltOnAttack,
} from "./skillEffects";

// Centralized skill base values - single source of truth
export const SKILL_BASE_VALUES = {
  FIRE_BURN_DAMAGE: 20,
  FIRE_PERCENTAGE_DAMAGE: 5,
  FIRE_LIGHTNING_BOLT_COOLDOWN: 30000, // 30 seconds
  ICE_SLOW_EFFECT: 5,
  EARTH_SPLASH_DAMAGE: 20,
  EARTH_SPLASH_MAX: 100,
  EARTH_SPLASH_RADIUS: 50,
  AIR_BURST_SHOTS: 2,
  AIR_BURST_COOLDOWN: 8000,
  AIR_CRITICAL_HIT_CHANCE: 5,
} as const;

export const allSkills: Skill[] = [
  createSkill({
    id: "fire_burn",
    name: "Fire Burns",
    description: "Fire attacks apply burn damage over time to enemies",
    cost: 0,
    unlockRequirements: { fire: 5 },
    icon: "1",
    category: "attack_modifier",
    statName: "Burn Damage",
    baseValue: SKILL_BASE_VALUES.FIRE_BURN_DAMAGE,
    upgradeId: "fire_burn_damage_upgrade",
    onHit: fireBurnOnHit,
  }),
  createSkill({
    id: "ice_slow",
    name: "Ice Freezes",
    description: "Ice attacks slow enemy movement speed",
    cost: 0,
    unlockRequirements: { ice: 5 },
    icon: "1",
    category: "attack_modifier",
    statName: "Slow Effect",
    baseValue: SKILL_BASE_VALUES.ICE_SLOW_EFFECT,
    upgradeId: "ice_slow_effect_upgrade",
    onHit: iceSlowOnHit,
  }),
  createSkill({
    id: "earth_splash",
    name: "Rocks Crash",
    description: "Earth attacks deal splash damage to nearby enemies",
    cost: 0,
    unlockRequirements: { earth: 5 },
    icon: "1",
    category: "attack_modifier",
    statName: "Splash Damage",
    baseValue: SKILL_BASE_VALUES.EARTH_SPLASH_DAMAGE,
    upgradeId: "earth_splash_damage_upgrade",
    maxValue: SKILL_BASE_VALUES.EARTH_SPLASH_MAX,
    onHit: earthSplashOnHit,
  }),
  createSkill({
    id: "air_burst",
    name: "Wind Gusts",
    description: "Air defenders periodically fire multiple attacks at once",
    cost: 0,
    unlockRequirements: { air: 5 },
    icon: "1",
    category: "active",
    priority: 1,
    cooldown: SKILL_BASE_VALUES.AIR_BURST_COOLDOWN,
    cooldownUpgradeId: "air_burst_cooldown_upgrade",
    statName: "Burst Shots",
    baseValue: SKILL_BASE_VALUES.AIR_BURST_SHOTS,
    upgradeId: "air_burst_shots_upgrade",
    unit: "",
    onAttack: airBurstOnAttack,
  }),

  createSkill({
    id: "fire_percentage_damage",
    name: "Percentage Health Damage",
    description: "Fire arrows do % health damage to non-burning enemies",
    cost: 30000,
    unlockRequirements: { fire: 25 },
    icon: "2",
    category: "attack_modifier",
    statName: "% Health Damage",
    baseValue: SKILL_BASE_VALUES.FIRE_PERCENTAGE_DAMAGE,
    upgradeId: "fire_percentage_damage_upgrade",
    onHit: firePercentageDamageOnHit,
  }),
  createSkill({
    id: "fire_burn_stacking",
    name: "Burn Stacking",
    description: "Fire arrows stack burn damage instead of refreshing duration",
    cost: 75000,
    unlockRequirements: { fire: 35 },
    icon: "4",
    category: "attack_modifier",
  }),
  createSkill({
    id: "fire_lightning_bolt",
    name: "Lightning Bolt",
    description:
      "Lightning bolt instantly kills the highest HP enemy on the map",
    cost: 25,
    unlockRequirements: { fire: 5 },
    icon: "6",
    category: "active",
    priority: 2,
    cooldown: SKILL_BASE_VALUES.FIRE_LIGHTNING_BOLT_COOLDOWN,
    cooldownUpgradeId: "fire_lightning_bolt_cooldown_upgrade",
    onAttack: fireLightningBoltOnAttack,
  }),
  createSkill({
    id: "fire_bonus_1",
    name: "Fire Power Upgrade",
    description: "[TBD - Fire Power Upgrade]",
    cost: 1000000,
    unlockRequirements: { fire: 75 },

    icon: "8",
    category: "attack_modifier",
  }),
  createSkill({
    id: "fire_bonus_2",
    name: "Ultimate Fire Ability",
    description: "[TBD - Ultimate Fire Ability]",
    cost: 2000000,
    unlockRequirements: { fire: 85 },

    icon: "9",
    category: "attack_modifier",
  }),

  createSkill({
    id: "ice_permafrost",
    name: "Permafrost",
    description: "On first hit from ice tower, freeze enemy for 1s",
    cost: 30000,
    unlockRequirements: { ice: 15 },

    icon: "2",
    category: "attack_modifier",
  }),
  createSkill({
    id: "ice_damage_upgrade",
    name: "Ice Damage Enhancement",
    description: "[TBD - Ice Damage Upgrade]",
    cost: 75000,
    unlockRequirements: { ice: 35 },

    icon: "4",
    category: "attack_modifier",
  }),
  createSkill({
    id: "ice_critical_vulnerability",
    name: "Critical Vulnerability",
    description: "Any hits on slowed enemies have increased crit chance",
    cost: 250000,
    unlockRequirements: { ice: 55 },

    icon: "6",
    category: "attack_modifier",
  }),
  createSkill({
    id: "ice_bonus_1",
    name: "Ice Power Upgrade",
    description: "[TBD - Ice Power Upgrade]",
    cost: 1000000,
    unlockRequirements: { ice: 75 },

    icon: "8",
    category: "attack_modifier",
  }),
  createSkill({
    id: "ice_bonus_2",
    name: "Ultimate Ice Ability",
    description: "[TBD - Ultimate Ice Ability]",
    cost: 2000000,
    unlockRequirements: { ice: 85 },

    icon: "9",
    category: "attack_modifier",
  }),

  createSkill({
    id: "earth_smart_targeting",
    name: "Smart Targeting",
    description: "Target highest enemy density for maximum splash",
    cost: 30000,
    unlockRequirements: { earth: 15 },

    icon: "2",
    category: "attack_modifier",
  }),
  createSkill({
    id: "earth_stone_skin",
    name: "Stone Skin",
    description: "Reduces all incoming damage to castle",
    cost: 75000,
    unlockRequirements: { earth: 35 },

    icon: "4",
    category: "attack_modifier",
  }),
  createSkill({
    id: "earth_earthquake",
    name: "Earthquake",
    description: "Hit all enemies on the map",
    cost: 250000,
    unlockRequirements: { earth: 55 },

    icon: "6",
    category: "attack_modifier",
  }),
  createSkill({
    id: "earth_fissure",
    name: "Fissure",
    description: "Damage all enemies in a horizontal line in front of the mage",
    cost: 1000000,
    unlockRequirements: { earth: 75 },

    icon: "8",
    category: "attack_modifier",
  }),
  createSkill({
    id: "earth_fragment_explosion",
    name: "Fragment Explosion",
    description: "Earth fragments explode again",
    cost: 2000000,
    unlockRequirements: { earth: 85 },

    icon: "9",
    category: "attack_modifier",
  }),

  createSkill({
    id: "air_critical_hit",
    name: "Critical Hit Chance",
    description: "% Critical hit chance for massive damage",
    cost: 30000,
    unlockRequirements: { air: 15 },
    icon: "2",
    category: "attack_modifier",
    statName: "Crit Chance",
    baseValue: SKILL_BASE_VALUES.AIR_CRITICAL_HIT_CHANCE,
    upgradeId: "air_critical_hit_chance_upgrade",
  }),
  createSkill({
    id: "air_double_attack_speed",
    name: "Double Attack Speed",
    description: "Double the attack speed of neighboring mages",
    cost: 75000,
    unlockRequirements: { air: 35 },

    icon: "4",
    category: "attack_modifier",
  }),
  createSkill({
    id: "air_smart_burst_targeting",
    name: "Smart Burst Targeting",
    description:
      "Burst arrows can target different enemies based on predicted damage",
    cost: 250000,
    unlockRequirements: { air: 55 },

    icon: "6",
    category: "attack_modifier",
  }),
  createSkill({
    id: "air_bonus_1",
    name: "Air Power Upgrade",
    description: "[TBD - Air Power Upgrade]",
    cost: 1000000,
    unlockRequirements: { air: 75 },

    icon: "8",
    category: "attack_modifier",
  }),
  createSkill({
    id: "air_bonus_2",
    name: "Ultimate Air Ability",
    description: "[TBD - Ultimate Air Ability]",
    cost: 2000000,
    unlockRequirements: { air: 85 },

    icon: "9",
    category: "attack_modifier",
  }),

  // Multi-element synergy skills (no duplicates!)
  createSkill({
    id: "freezeburn",
    name: "Freezeburn",
    description: "Frozen enemies take double burn damage",
    cost: 50000,
    unlockRequirements: { fire: 25, ice: 25 },

    icon: "3",
    category: "attack_modifier",
  }),
  createSkill({
    id: "firewave",
    name: "Firewave",
    description: "Sends out a semi-circle of fire arrows",
    cost: 100000,
    unlockRequirements: { fire: 45, air: 45 },

    icon: "5",
    category: "attack_modifier",
  }),
  createSkill({
    id: "disco_inferno",
    name: "Disco Inferno",
    description: "On death, burn spreads to nearby enemies",
    cost: 500000,
    unlockRequirements: { fire: 65, earth: 65 },
    icon: "7",
    category: "attack_modifier",
    statName: "Spread Radius",
    baseValue: 100,
    upgradeId: "disco_inferno_spread_radius_upgrade",
  }),
  createSkill({
    id: "blizzard",
    name: "Blizzard",
    description: "Ice circles appear on map that slow and damage enemies",
    cost: 100000,
    unlockRequirements: { ice: 45, earth: 45 },

    icon: "5",
    category: "attack_modifier",
  }),
  createSkill({
    id: "icy_wind",
    name: "Icy Wind",
    description: "Creates wind currents that slow all enemies on the map",
    cost: 500000,
    unlockRequirements: { ice: 65, air: 65 },

    icon: "7",
    category: "attack_modifier",
  }),
  createSkill({
    id: "vortex",
    name: "Vortex",
    description: "Pulls enemies into tighter groups",
    cost: 50000,
    unlockRequirements: { earth: 25, air: 25 },

    icon: "3",
    category: "attack_modifier",
  }),
  createSkill({
    id: "vortex",
    name: "Vortex",
    description: "Pulls enemies into tighter groups",
    cost: 50000,
    unlockRequirements: { earth: 25, air: 25 },

    icon: "3",
    category: "attack_modifier",
  }),
];

// Helper function to create skills with dynamic stats and centralized base values
function createSkill(config: {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlockRequirements: Record<string, number>;
  icon: string;
  category: SkillCategory;
  statName?: string;
  baseValue?: number;
  upgradeId?: string;
  unit?: string;
  maxValue?: number;
  priority?: number;
  cooldown?: number;
  cooldownUpgradeId?: string; // For cooldown upgrades
  onHit?: (enemy: Enemy, damage: number, context: SkillContext) => void;
  onAttack?: (defender: Defender, target: Enemy, context: SkillContext) => void;
}): Skill {
  const skill: Skill = {
    id: config.id,
    name: config.name,
    description: config.description,
    cost: config.cost,
    unlockRequirements: config.unlockRequirements,
    icon: config.icon,
    category: config.category,
  };

  // Add optional fields
  if (config.priority !== undefined) skill.priority = config.priority;
  if (config.onHit) skill.onHit = config.onHit;
  if (config.onAttack) skill.onAttack = config.onAttack;

  // Add static cooldown - dynamic calculation happens in defender logic
  if (config.cooldown !== undefined) {
    skill.cooldown = config.cooldown;
  }
  if (config.cooldownUpgradeId) {
    skill.cooldownUpgradeId = config.cooldownUpgradeId;
  }

  // Add dynamic stat calculation if base value is provided
  if (config.statName && config.baseValue !== undefined) {
    skill.statName = config.statName;

    if (config.upgradeId) {
      // Dynamic stat value with upgrades
      skill.statValue = (purchases: Record<string, number>) => {
        const finalValue = calculateSkillValue(
          config.baseValue!,
          config.upgradeId!,
          purchases,
          config.maxValue
        );
        return `${finalValue}${config.unit || "%"}`;
      };
    } else {
      // Static stat value
      skill.statValue = `${config.baseValue}${config.unit || "%"}`;
    }
  }

  return skill;
}
