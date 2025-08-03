import type { Defender, Enemy, Arrow } from "../../types/GameState";
import type { ElementType } from "../../data/elements";
import { getDefenderData } from "../../data/defenders";
import { createArrow } from "./arrow";
import { calculateElementAbilities } from "../../data/elements";

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
  // Range is based on distance from castle (left edge), not 2D distance
  const enemiesInRange = enemies.filter((enemy) => {
    const distanceFromCastle = enemy.x - 50; // Castle is at x=50

    // Log range check
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

  if (enemiesInRange.length === 0) {
    return null;
  }

  // Find the nearest enemy (closest to castle)
  const target = enemiesInRange.reduce((nearest, enemy) => {
    const nearestDistance = nearest.x - 50;
    const enemyDistance = enemy.x - 50;
    return enemyDistance < nearestDistance ? enemy : nearest;
  });

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
  predictedBurnDamage: Map<string, number>,
  purchases: Record<string, number> = {}
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
      return defender;
    }

    // Check if burst is available for Air defenders
    const elementAbilities = calculateElementAbilities(
      defender.type,
      purchases
    );
    const canBurst =
      defender.type === "air" &&
      elementAbilities.burstShots &&
      elementAbilities.burstShots > 0 &&
      (!defender.burstCooldownEnd || currentTime >= defender.burstCooldownEnd);

    // Update predicted damage for this target (only the first arrow initially)
    const currentPredictedDamage =
      updatedPredictedArrowDamage.get(target.id) || 0;
    const newPredictedDamage = currentPredictedDamage + defender.damage;
    updatedPredictedArrowDamage.set(target.id, newPredictedDamage);

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

    // If burst is available, create additional burst arrows
    if (canBurst && elementAbilities.burstShots) {
      const burstShots = elementAbilities.burstShots;
      console.log(`💨 Air burst: Firing ${burstShots} arrows at once!`);

      // Add burst arrow damage to predicted damage
      const burstDamage = defender.damage * (burstShots - 1); // -1 because first arrow already counted
      const currentBurstPredictedDamage =
        updatedPredictedArrowDamage.get(target.id) || 0;
      updatedPredictedArrowDamage.set(
        target.id,
        currentBurstPredictedDamage + burstDamage
      );

      for (let i = 1; i < burstShots; i++) {
        const burstArrow = createArrow(
          defender.x + 20,
          defender.y + 20,
          predictedX + 20,
          predictedY + 20,
          currentTime + i * 50, // Add 50ms delay between burst arrows
          defender.type,
          target.id
        );
        newArrows.push(burstArrow);
      }
    }

    // Set burst cooldown if burst was used
    const burstCooldownEnd =
      canBurst && elementAbilities.burstCooldown
        ? currentTime + elementAbilities.burstCooldown * 1000
        : defender.burstCooldownEnd;

    return {
      ...defender,
      lastAttack: currentTime,
      burstCooldownEnd,
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
