/**
 * Centralized mutation helpers for game state.
 *
 * These functions explicitly mutate their arguments - this is intentional
 * since we use ref-based state management.
 */

import type { ElementData, MageProgress } from "../../types/GameState";
import type { ElementType } from "../../data/elements";
import { getLevelFromXP, calculateElementStats } from "../../data/elements";
import { getStarDamageMultiplier } from "../starSystem";

/**
 * Grant XP to an element and handle level-ups.
 * On level-up, damage is recalculated if mageProgress is provided.
 *
 * @mutates elements[type].xp, elements[type].totalDamage, elements[type].level, elements[type].baseStats
 */
export function grantElementXP(
  elements: Record<ElementType, ElementData>,
  type: ElementType,
  xp: number,
  mageProgress?: MageProgress
): { leveledUp: boolean; newLevel: number } {
  const element = elements[type];
  const oldLevel = element.level;

  element.xp += xp;
  element.totalDamage += xp;

  const newLevel = getLevelFromXP(element.xp);
  if (newLevel > oldLevel) {
    element.level = newLevel;
    if (mageProgress) {
      recalculateElementDamage(elements, type, mageProgress);
    }
    return { leveledUp: true, newLevel };
  }

  return { leveledUp: false, newLevel: oldLevel };
}

/**
 * Recalculate element damage based on star multiplier.
 * Called after merges to update element.baseStats.damage.
 *
 * @mutates elements[type].baseStats
 */
export function recalculateElementDamage(
  elements: Record<ElementType, ElementData>,
  type: ElementType,
  mageProgress: MageProgress
): void {
  const starMultiplier = getStarDamageMultiplier(mageProgress);
  elements[type].baseStats = calculateElementStats(type, elements[type].level, starMultiplier);
}
