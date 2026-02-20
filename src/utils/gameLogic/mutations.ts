/**
 * Centralized mutation helpers for game state.
 *
 * These functions explicitly mutate their arguments - this is intentional
 * since we use ref-based state management.
 */

import type { ElementData } from "../../types/GameState";
import type { ElementType } from "../../data/elements";
import { getLevelFromXP, calculateElementStats } from "../../data/elements";

/**
 * Grant XP to an element and handle level-ups.
 *
 * @mutates elements[type].xp, elements[type].totalDamage, elements[type].level, elements[type].baseStats
 */
export function grantElementXP(
  elements: Record<ElementType, ElementData>,
  type: ElementType,
  xp: number
): { leveledUp: boolean; newLevel: number } {
  const element = elements[type];
  const oldLevel = element.level;

  element.xp += xp;
  element.totalDamage += xp;

  const newLevel = getLevelFromXP(element.xp);
  if (newLevel > oldLevel) {
    element.level = newLevel;
    element.baseStats = calculateElementStats(type, newLevel);
    return { leveledUp: true, newLevel };
  }

  return { leveledUp: false, newLevel: oldLevel };
}
