import type { Defender, Enemy, Arrow } from "../../types/GameState";
import type { ElementType } from "../../data/elements";
import { getDefenderData } from "../../data/defenders";
import { createArrow } from "./arrow";

export const createDefender = (
  x: number,
  y: number,
  defenderType: ElementType
): Defender => {
  const data = getDefenderData(defenderType);
  if (!data) {
    throw new Error(`Unknown defender type: ${defenderType}`);
  }

  return {
    id: `defender_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: defenderType,
    x,
    y,
    damage: data.damage,
    attackSpeed: data.attackSpeed,
    range: data.range,
    lastAttack: 0,
    level: 1,
    cost: data.cost,
  };
};

export const findNearestEnemy = (
  defender: Defender,
  enemies: Enemy[],
  predictedDamage: Map<string, number>
): Enemy | null => {
  // Range is based on distance from castle (left edge), not 2D distance
  const enemiesInRange = enemies.filter((enemy) => {
    const distanceFromCastle = enemy.x - 50; // Castle is at x=50
    if (distanceFromCastle > defender.range) return false;

    // Check if enemy will be dead from predicted damage
    let totalPredictedDamage = predictedDamage.get(enemy.id) || 0;

    // For fire defenders, also account for burn damage
    if (defender.type === "fire" && enemy.burnDamage && enemy.burnEndTime) {
      const currentTime = Date.now();
      if (currentTime < enemy.burnEndTime) {
        // Calculate remaining burn ticks
        const burnTickInterval = 500;
        const burnStartTime = enemy.burnEndTime - 2000; // 2 second duration
        const timeSinceBurnStart = currentTime - burnStartTime;
        const currentTick = Math.floor(timeSinceBurnStart / burnTickInterval);
        const totalTicks = 4; // 2 seconds / 500ms
        const remainingTicks = Math.max(0, totalTicks - currentTick);
        const remainingBurnDamage = enemy.burnDamage * remainingTicks;
        totalPredictedDamage += remainingBurnDamage;
      }
    }

    const finalPredictedHealth = enemy.health - totalPredictedDamage;
    return finalPredictedHealth > 0;
  });

  if (enemiesInRange.length === 0) return null;

  // Find the nearest enemy (closest to castle)
  return enemiesInRange.reduce((nearest, enemy) => {
    const nearestDistance = nearest.x - 50;
    const enemyDistance = enemy.x - 50;
    return enemyDistance < nearestDistance ? enemy : nearest;
  });
};

export const canDefenderAttack = (
  defender: Defender,
  currentTime: number
): boolean => {
  return currentTime - defender.lastAttack > 1000 / defender.attackSpeed;
};

export const updateDefenders = (
  defenders: Defender[],
  enemies: Enemy[],
  currentTime: number,
  predictedDamage: Map<string, number>
): {
  defenders: Defender[];
  enemies: Enemy[];
  arrows: Arrow[];
  predictedDamage: Map<string, number>;
} => {
  const currentEnemies = [...enemies];
  const newArrows: Arrow[] = [];
  const updatedPredictedDamage = new Map(predictedDamage);

  const updatedDefenders = defenders.map((defender) => {
    if (!canDefenderAttack(defender, currentTime)) {
      return defender;
    }

    const target = findNearestEnemy(
      defender,
      currentEnemies,
      updatedPredictedDamage
    );
    if (!target) {
      return defender;
    }

    // Update predicted damage for this target
    const currentPredictedDamage = updatedPredictedDamage.get(target.id) || 0;
    updatedPredictedDamage.set(
      target.id,
      currentPredictedDamage + defender.damage
    );

    // Calculate where the enemy will be when the arrow arrives
    const arrowSpeed = 300; // pixels per second
    const distance = Math.sqrt(
      Math.pow(target.x + 20 - (defender.x + 20), 2) +
        Math.pow(target.y + 20 - (defender.y + 20), 2)
    );
    const flightTime = (distance / arrowSpeed) * 1000; // milliseconds

    // Predict enemy position at arrow impact time
    const predictedX = target.x + (target.speed * flightTime) / 1000;
    const predictedY = target.y; // Enemies only move horizontally

    // Create arrow projectile with predicted target position
    const arrow = createArrow(
      defender.x + 20, // Center of defender
      defender.y + 20,
      predictedX + 20, // Center of predicted enemy position
      predictedY + 20,
      currentTime,
      defender.type, // Element type of the defender
      target.id // Store the target enemy ID for precise targeting
    );
    newArrows.push(arrow);

    return {
      ...defender,
      lastAttack: currentTime,
    };
  });

  return {
    defenders: updatedDefenders,
    enemies: currentEnemies,
    arrows: newArrows,
    predictedDamage: updatedPredictedDamage,
  };
};
