// Enemy functions
export {
  generateEnemyId,
  createEnemy,
  moveEnemies,
  removeDeadEnemies,
  removeEnemiesPastCastle,
  damageEnemy,
  damageCastle,
  handleEnemyDeath,
} from "./enemy";

// Defender functions
export {
  createDefender,
  findNearestEnemy,
  canDefenderAttack,
  updateDefenders,
} from "./defender";

// Arrow functions
export {
  generateArrowId,
  createArrow,
  updateArrows,
  getArrowProgress,
  processArrowImpacts,
} from "./arrow";

// UI utility functions
export {
  generateFloatingTextId,
  createFloatingText,
  generateLevelUpAnimationId,
  createLevelUpAnimation,
} from "./uiUtils";

// Effect functions
export { processBurnDamage } from "./effects";

// Game state functions
export { handleCastleDestruction } from "./gameState";

// Mage limit utilities
import type { ElementType } from "../../data/elements";
import type { Defender } from "../../types/GameState";

/**
 * Calculate the maximum number of mages allowed for an element based on its level
 * Formula: (element level / 10) + 1
 */
export const getMaxMagesForElement = (elementLevel: number): number => {
  return Math.floor(elementLevel / 10) + 1;
};

/**
 * Count current mages of a specific element type
 */
export const countMagesOfElement = (
  defenders: Defender[],
  elementType: ElementType
): number => {
  return defenders.filter((defender) => defender.type === elementType).length;
};

/**
 * Calculate the next level where a mage/defender slot unlocks
 * Mage slots unlock every 10 levels (10, 20, 30, etc.)
 */
export const getNextMageDefenderLevel = (elementLevel: number): number => {
  return Math.floor(elementLevel / 10) * 10 + 10;
};

/**
 * Check if a new mage of the given element can be purchased
 */
export const canPurchaseMage = (
  defenders: Defender[],
  elementType: ElementType,
  elementLevel: number
): boolean => {
  const currentCount = countMagesOfElement(defenders, elementType);
  const maxAllowed = getMaxMagesForElement(elementLevel);
  return currentCount < maxAllowed;
};
