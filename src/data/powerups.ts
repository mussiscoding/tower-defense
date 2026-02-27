import type { PowerUpDef, GameState } from "../types/GameStateSlices";
import type { ElementType } from "./elements";
import { getXPForNextLevel } from "./elements";
import { ELEMENT_COLORS } from "../constants/elementColors";

const ALL_ELEMENTS: ElementType[] = ["fire", "ice", "earth", "air"];

const getRandomElement = (): ElementType =>
  ALL_ELEMENTS[Math.floor(Math.random() * ALL_ELEMENTS.length)];

const getLowestLevelElement = (state: GameState): ElementType => {
  let lowest: ElementType = "fire";
  let lowestLevel = Infinity;
  for (const et of ALL_ELEMENTS) {
    const level = state.core.elements[et]?.level ?? 1;
    if (level < lowestLevel) {
      lowestLevel = level;
      lowest = et;
    }
  }
  return lowest;
};

const goldRushAmount = (state: GameState): number =>
  Math.floor(state.core.totalGoldEarned * 0.05) + 50;

export const POWER_UP_DEFS: PowerUpDef[] = [
  // --- Phase 1 ---
  {
    id: "fury",
    name: "Fury",
    description: "2x damage for all mages for 30s",
    icon: "⚔️",
    color: "#ff4444",
    duration: 30000,
    spawnWeight: 10,
    applyEffect: () => {},
  },
  {
    id: "gold_rush",
    name: "Gold Rush",
    description: "Instant gold drop",
    icon: "💰",
    color: "#ffd700",
    duration: 0,
    spawnWeight: 15,
    applyEffect: (state) => {
      const gold = goldRushAmount(state);
      state.core.gold += gold;
      state.core.totalGoldEarned += gold;
    },
  },
  {
    id: "midas_touch",
    name: "Midas Touch",
    description: "2x gold from kills for 30s",
    icon: "👑",
    color: "#ffaa00",
    duration: 30000,
    spawnWeight: 10,
    applyEffect: () => {},
  },
  {
    id: "wisdom",
    name: "Wisdom",
    description: "2x XP gain for all elements for 30s",
    icon: "📖",
    color: "#44cc44",
    duration: 30000,
    spawnWeight: 10,
    applyEffect: () => {},
  },
  // --- Phase 2 ---
  {
    id: "elemental_surge",
    name: "Elemental Surge",
    description: "3x damage for one random element for 20s",
    icon: "⚡",
    color: "#9966ff", // overridden per-element in HUD
    duration: 20000,
    spawnWeight: 8,
    applyEffect: () => {},
    resolveElementType: () => getRandomElement(),
  },
  {
    id: "rapid_fire",
    name: "Rapid Fire",
    description: "2x attack speed for all mages for 25s",
    icon: "💨",
    color: "#ffdd44",
    duration: 25000,
    spawnWeight: 8,
    applyEffect: () => {},
  },
  {
    id: "treasure_chest",
    name: "Treasure Chest",
    description: "Large gold drop",
    icon: "🎁",
    color: "#ffd700",
    duration: 0,
    spawnWeight: 3,
    applyEffect: (state) => {
      const gold = goldRushAmount(state) * 5;
      state.core.gold += gold;
      state.core.totalGoldEarned += gold;
    },
  },
  {
    id: "mentorship",
    name: "Mentorship",
    description: "3x XP for lowest-level element for 30s",
    icon: "🎓",
    color: "#22dd66",
    duration: 30000,
    spawnWeight: 8,
    applyEffect: () => {},
    resolveElementType: (state) => getLowestLevelElement(state),
  },
  {
    id: "study_session",
    name: "Study Session",
    description: "Instant XP for lowest-level element",
    icon: "📚",
    color: "#117733",
    duration: 0,
    spawnWeight: 10,
    applyEffect: (state) => {
      const et = getLowestLevelElement(state);
      const element = state.core.elements[et];
      if (!element) return;
      const xpGrant = Math.floor(getXPForNextLevel(element.level) * 0.3);
      element.xp += xpGrant;
      element.totalDamage += xpGrant;
      // Level recalc happens next tick via normal XP processing
    },
  },
];

export const getPowerUpDef = (id: string): PowerUpDef | undefined =>
  POWER_UP_DEFS.find((p) => p.id === id);

export const selectWeightedPowerUp = (): PowerUpDef => {
  const totalWeight = POWER_UP_DEFS.reduce((sum, p) => sum + p.spawnWeight, 0);
  let roll = Math.random() * totalWeight;
  for (const powerUp of POWER_UP_DEFS) {
    roll -= powerUp.spawnWeight;
    if (roll <= 0) return powerUp;
  }
  return POWER_UP_DEFS[0];
};

/** Get the display color for an active power-up, using element color for element-specific buffs */
export const getPowerUpColor = (powerUpId: string, elementType?: ElementType): string => {
  if (elementType && (powerUpId === "elemental_surge" || powerUpId === "mentorship")) {
    return ELEMENT_COLORS[elementType] ?? "#9966ff";
  }
  return getPowerUpDef(powerUpId)?.color ?? "#ffffff";
};

/** Get gold amount for display (before applyEffect mutates state) */
export const getGoldDropAmount = (state: GameState, powerUpId: string): number => {
  if (powerUpId === "gold_rush") return goldRushAmount(state);
  if (powerUpId === "treasure_chest") return goldRushAmount(state) * 5;
  return 0;
};

/** Get XP amount for display (before applyEffect mutates state) */
export const getXpDropAmount = (state: GameState, powerUpId: string): number => {
  if (powerUpId === "study_session") {
    const et = getLowestLevelElement(state);
    const element = state.core.elements[et];
    if (!element) return 0;
    return Math.floor(getXPForNextLevel(element.level) * 0.3);
  }
  return 0;
};
