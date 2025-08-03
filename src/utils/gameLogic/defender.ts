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
  predictedArrowDamage: Map<string, number>,
  predictedBurnDamage: Map<string, number>
): Enemy | null => {
  console.log(
    `🔍 ${defender.type} tower looking for targets. Total enemies: ${enemies.length}`
  );

  // Range is based on distance from castle (left edge), not 2D distance
  const enemiesInRange = enemies.filter((enemy) => {
    const distanceFromCastle = enemy.x - 50; // Castle is at x=50

    // Log range check
    if (distanceFromCastle > defender.range) {
      console.log(
        `📏 ${defender.type} tower: Enemy ${enemy.id} (${enemy.type}) out of range - Distance: ${distanceFromCastle}, Range: ${defender.range}`
      );
      return false;
    }

    // Check if enemy will be dead from predicted damage
    const arrowPredictedDamage = predictedArrowDamage.get(enemy.id) || 0;
    const burnPredictedDamage = predictedBurnDamage.get(enemy.id) || 0;
    const totalPredictedDamage = arrowPredictedDamage + burnPredictedDamage;
    console.log(
      `🎯 ${defender.type} tower checking enemy ${enemy.id} (${enemy.type}) - Health: ${enemy.health}, Arrow Predicted: ${arrowPredictedDamage}, Burn Predicted: ${burnPredictedDamage}, Total: ${totalPredictedDamage}`
    );

    const finalPredictedHealth = enemy.health - totalPredictedDamage;
    console.log(
      `📊 ${defender.type} tower: Enemy ${enemy.id} final predicted health: ${finalPredictedHealth}`
    );

    // Debug: Log when towers skip enemies
    if (finalPredictedHealth <= 0 && enemy.health > 0) {
      console.log(
        `🎯 ${defender.type} tower skipping enemy ${enemy.id} - Health: ${enemy.health}, Predicted: ${totalPredictedDamage}, Final: ${finalPredictedHealth}`
      );
    }

    return finalPredictedHealth > 0;
  });

  console.log(
    `🎯 ${defender.type} tower: Found ${enemiesInRange.length} enemies in range`
  );

  if (enemiesInRange.length === 0) {
    console.log(`❌ ${defender.type} tower: No valid targets found`);
    return null;
  }

  // Find the nearest enemy (closest to castle)
  const target = enemiesInRange.reduce((nearest, enemy) => {
    const nearestDistance = nearest.x - 50;
    const enemyDistance = enemy.x - 50;
    return enemyDistance < nearestDistance ? enemy : nearest;
  });

  console.log(
    `✅ ${defender.type} tower: Selected target ${target.id} (${target.type}) at x=${target.x}`
  );
  return target;
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
  predictedArrowDamage: Map<string, number>,
  predictedBurnDamage: Map<string, number>
): {
  defenders: Defender[];
  enemies: Enemy[];
  arrows: Arrow[];
  predictedArrowDamage: Map<string, number>;
  predictedBurnDamage: Map<string, number>;
} => {
  const currentEnemies = [...enemies];
  const newArrows: Arrow[] = [];
  const updatedPredictedArrowDamage = new Map(predictedArrowDamage);
  const updatedPredictedBurnDamage = new Map(predictedBurnDamage);

  const updatedDefenders = defenders.map((defender) => {
    if (!canDefenderAttack(defender, currentTime)) {
      return defender;
    }

    const target = findNearestEnemy(
      defender,
      currentEnemies,
      updatedPredictedArrowDamage,
      updatedPredictedBurnDamage
    );
    if (!target) {
      console.log(
        `⏸️ ${defender.type} tower: No target found, skipping attack`
      );
      return defender;
    }

    // Update predicted damage for this target
    const currentPredictedDamage =
      updatedPredictedArrowDamage.get(target.id) || 0;
    const newPredictedDamage = currentPredictedDamage + defender.damage;
    updatedPredictedArrowDamage.set(target.id, newPredictedDamage);

    console.log(
      `⚔️ ${defender.type} tower attacking ${target.id} (${target.type}) - Adding ${defender.damage} predicted damage (${currentPredictedDamage} → ${newPredictedDamage})`
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
    predictedArrowDamage: updatedPredictedArrowDamage,
    predictedBurnDamage: updatedPredictedBurnDamage,
  };
};
