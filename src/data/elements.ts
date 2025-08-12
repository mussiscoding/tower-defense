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
    baseStats: { damage: 10, attackSpeed: 1.0, range: 700 },
    abilities: { burnDamagePercent: 20, burnDuration: 2 },
    upgradeFactors: { burnDamagePercent: 1 },
  },
  ice: {
    name: "Ice",
    baseStats: { damage: 8, attackSpeed: 1.0, range: 700 },
    abilities: { slowEffect: 5, slowDuration: 3 },
    upgradeFactors: { slowEffect: 1.2 },
  },
  earth: {
    name: "Earth",
    baseStats: { damage: 15, attackSpeed: 0.4, range: 700 },
    abilities: { splashDamage: 20, splashRadius: 50 },
    upgradeFactors: { splashDamage: 1.4, splashRadius: 1.2 },
  },
  air: {
    name: "Air",
    baseStats: { damage: 5, attackSpeed: 1.5, range: 700 },
    abilities: {
      burstShots: 2,
      burstCooldown: 8,
    },
    upgradeFactors: { burstShots: 1, burstCooldown: 1 },
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
  return Math.floor(200 * Math.pow(1.3, level - 1));
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

// calculateElementAbilities function removed - functionality moved to skills system
// UI components should use getActiveSkillsForElement() from skillUtils instead
