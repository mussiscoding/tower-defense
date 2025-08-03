import type {
  ElementData,
  ElementBaseStats,
  ElementAbilities,
} from "../types/GameState";

export type ElementType = "fire" | "ice" | "earth" | "air";

export interface ElementDefinition {
  name: string;
  baseStats: ElementBaseStats;
  abilities: ElementAbilities;
  upgradeFactors: ElementAbilities;
}

export const elements: Record<ElementType, ElementDefinition> = {
  fire: {
    name: "Fire",
    baseStats: { damage: 2, attackSpeed: 1.0, range: 700 },
    abilities: { burnDamage: 4, burnDuration: 2 },
    upgradeFactors: { burnDamage: 1.2, burnDuration: 1.3 },
  },
  ice: {
    name: "Ice",
    baseStats: { damage: 8, attackSpeed: 1.0, range: 700 },
    abilities: { slowEffect: 5, slowDuration: 3 },
    upgradeFactors: { slowEffect: 1.2, slowDuration: 1.3 },
  },
  earth: {
    name: "Earth",
    baseStats: { damage: 15, attackSpeed: 0.8, range: 700 },
    abilities: { splashDamage: 0, splashRadius: 0 },
    upgradeFactors: { splashDamage: 1.4, splashRadius: 1.2 },
  },
  air: {
    name: "Air",
    baseStats: { damage: 5, attackSpeed: 1.5, range: 700 },
    abilities: {
      burstAttackSpeed: 0,
      burstDuration: 0,
    },
    upgradeFactors: { burstAttackSpeed: 1.3, burstDuration: 1.2 },
  },
} as const;

export const getAvailableElements = (): ElementType[] => {
  return Object.keys(elements) as ElementType[];
};

export const createInitialElementData = (
  elementType: ElementType
): ElementData => {
  const element = elements[elementType];
  return {
    level: 1,
    xp: 0,
    totalDamage: 0,
    baseStats: { ...element.baseStats },
    abilities: { ...element.abilities },
  };
};

export const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0;

  let totalXP = 0;
  for (let l = 1; l < level; l++) {
    totalXP += getXPForNextLevel(l);
  }
  return totalXP;
};

export const getXPForNextLevel = (level: number): number => {
  return Math.floor((level - 1 + 300 * Math.pow(2, (level - 1) / 7)) / 4);
};

export const getLevelFromXP = (xp: number): number => {
  if (xp <= 0) return 1;

  let level = 1;
  let currentXP = 0;

  while (currentXP < xp && level < 99) {
    currentXP += getXPForNextLevel(level);
    level++;
  }

  return level - 1;
};

export const calculateElementStats = (
  elementType: ElementType,
  level: number
): ElementBaseStats => {
  const baseStats = elements[elementType].baseStats;
  const levelMultiplier = 1 + (level - 1) * 0.1;

  return {
    damage: Math.floor(baseStats.damage * levelMultiplier),
    attackSpeed: baseStats.attackSpeed,
    range: baseStats.range,
  };
};

export const calculateElementAbilities = (
  elementType: ElementType,
  purchases: Record<string, number>
): ElementAbilities => {
  const baseAbilities = elements[elementType].abilities;
  const upgradeFactors = elements[elementType].upgradeFactors;

  switch (elementType) {
    case "fire": {
      const burnDamageUpgrades = purchases["fire_burn_damage_upgrade"] || 0;
      const burnDurationUpgrades = purchases["fire_burn_duration_upgrade"] || 0;
      const burnDamageFactor = upgradeFactors.burnDamage || 1;
      const burnDurationFactor = upgradeFactors.burnDuration || 1;

      return {
        burnDamage: Math.floor(
          (baseAbilities.burnDamage || 0) *
            Math.pow(burnDamageFactor, burnDamageUpgrades)
        ),
        burnDuration: Math.floor(
          (baseAbilities.burnDuration || 0) *
            Math.pow(burnDurationFactor, burnDurationUpgrades)
        ),
      };
    }
    case "ice": {
      const slowEffectUpgrades = purchases["ice_slow_effect_upgrade"] || 0;
      const slowDurationUpgrades = purchases["ice_slow_duration_upgrade"] || 0;

      return {
        slowEffect: Math.floor(
          (baseAbilities.slowEffect || 0) + slowEffectUpgrades
        ),
        slowDuration: Math.floor(
          (baseAbilities.slowDuration || 0) + slowDurationUpgrades
        ),
      };
    }
    case "earth":
      return {
        splashDamage: baseAbilities.splashDamage,
        splashRadius: baseAbilities.splashRadius,
      };
    case "air":
      return {
        burstAttackSpeed: baseAbilities.burstAttackSpeed,
        burstDuration: baseAbilities.burstDuration,
      };
    default:
      return {};
  }
};
