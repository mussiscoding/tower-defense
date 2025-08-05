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
