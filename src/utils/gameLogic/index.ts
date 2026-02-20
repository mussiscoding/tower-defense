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
  updateVortexEffectsInGameLoop,
} from "./enemy";

// Defender functions
export { createDefender, canDefenderAttack, updateDefenders } from "./defender";

// Targeting functions
export { findNearestEnemy, findBestSplashEnemy } from "./targeting";

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

