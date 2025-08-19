import type { Defender, Enemy } from "../../types/GameState";
import { GAME_DIMENSIONS } from "../../constants/gameDimensions";

/**
 * Get enemies within defender range that are not predicted to die
 * Common logic used by both findNearestEnemy and findBestEarthTarget
 */
const getEnemiesInRange = (
  defender: Defender,
  enemies: Enemy[],
  predictedArrowDamage: Map<string, number>,
  predictedBurnDamage: Map<string, number>
): Enemy[] => {
  return enemies.filter((enemy) => {
    const distanceFromCastle = enemy.x - GAME_DIMENSIONS.CASTLE_WIDTH; // Castle is at x=75

    // Range check
    if (distanceFromCastle > defender.range) {
      return false;
    }

    // Check if enemy will be dead from predicted damage
    const arrowPredictedDamage = predictedArrowDamage.get(enemy.id) || 0;
    const burnPredictedDamage = predictedBurnDamage.get(enemy.id) || 0;
    const totalPredictedDamage = arrowPredictedDamage + burnPredictedDamage;

    const finalPredictedHealth = enemy.health - totalPredictedDamage;

    return finalPredictedHealth > 0;
  });
};

/**
 * Find the nearest enemy to the castle within defender range
 * Used by most defenders for basic targeting
 */
export const findNearestEnemy = (
  defender: Defender,
  enemies: Enemy[],
  predictedArrowDamage: Map<string, number>,
  predictedBurnDamage: Map<string, number>
): Enemy | null => {
  const enemiesInRange = getEnemiesInRange(
    defender,
    enemies,
    predictedArrowDamage,
    predictedBurnDamage
  );

  if (enemiesInRange.length === 0) {
    return null;
  }

  // Find the nearest enemy (closest to castle)
  const target = enemiesInRange.reduce((nearest, enemy) => {
    const nearestDistance = nearest.x - GAME_DIMENSIONS.CASTLE_WIDTH;
    const enemyDistance = enemy.x - GAME_DIMENSIONS.CASTLE_WIDTH;
    return enemyDistance < nearestDistance ? enemy : nearest;
  });

  return target;
};

/**
 * Calculate enemy density score for Earth defenders
 * Higher score means more enemies within splash radius
 */
const calculateEnemyDensityScore = (
  enemy: Enemy,
  allEnemies: Enemy[],
  splashRadius: number
): number => {
  const nearbyEnemies = allEnemies.filter((other) => {
    if (other.id === enemy.id) return false;

    const distance = Math.sqrt(
      Math.pow(other.x - enemy.x, 2) + Math.pow(other.y - enemy.y, 2)
    );
    return distance <= splashRadius;
  });

  return nearbyEnemies.length;
};

/**
 * Find the best target for Earth defenders based on enemy density
 * Prioritizes enemies surrounded by the most other enemies for maximum splash damage
 */
export const findBestSplashEnemy = (
  defender: Defender,
  enemies: Enemy[],
  predictedArrowDamage: Map<string, number>,
  predictedBurnDamage: Map<string, number>,
  splashRadius: number
): Enemy | null => {
  if (!splashRadius) {
    // Fallback to nearest enemy if no Earth element data
    return findNearestEnemy(
      defender,
      enemies,
      predictedArrowDamage,
      predictedBurnDamage
    );
  }

  // Get enemies in range using shared logic
  const enemiesInRange = getEnemiesInRange(
    defender,
    enemies,
    predictedArrowDamage,
    predictedBurnDamage
  );

  if (enemiesInRange.length === 0) {
    return null;
  }

  // Calculate density scores for all enemies in range
  const enemiesWithScores = enemiesInRange.map((enemy) => ({
    enemy,
    densityScore: calculateEnemyDensityScore(enemy, enemies, splashRadius),
  }));

  // Find the enemy with the highest density score
  const bestTarget = enemiesWithScores.reduce((best, current) =>
    current.densityScore > best.densityScore ? current : best
  );

  // If all enemies have the same density (0 or 1), fall back to nearest enemy
  if (bestTarget.densityScore <= 1) {
    return findNearestEnemy(
      defender,
      enemies,
      predictedArrowDamage,
      predictedBurnDamage
    );
  }

  return bestTarget.enemy;
};
