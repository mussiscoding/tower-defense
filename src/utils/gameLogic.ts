import type {
  GameState,
  Enemy,
  Defender,
  Arrow,
  GoldPopup,
} from "../types/GameState";
import { getAvailableEnemies, fallbackEnemy } from "../data/enemies";
import { getDefenderData, generateDefenderId } from "../data/defenders";

export const generateEnemyId = (): string => {
  return `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createEnemy = (
  x: number,
  y: number,
  difficultyLevel: number
): Enemy => {
  // Get available enemies based on difficulty level
  const availableEnemies = getAvailableEnemies(difficultyLevel);

  if (availableEnemies.length === 0) {
    availableEnemies.push(fallbackEnemy);
  }

  // Randomly select an available enemy
  const selectedEnemy =
    availableEnemies[Math.floor(Math.random() * availableEnemies.length)];

  return {
    id: generateEnemyId(),
    x,
    y,
    health: selectedEnemy.health,
    maxHealth: selectedEnemy.health,
    speed: selectedEnemy.speed,
    goldValue: selectedEnemy.goldValue,
    type: selectedEnemy.type,
  };
};

export const moveEnemies = (enemies: Enemy[]): Enemy[] => {
  return enemies.map((enemy) => ({
    ...enemy,
    x: enemy.x - enemy.speed,
  }));
};

export const removeDeadEnemies = (enemies: Enemy[]): Enemy[] => {
  return enemies.filter((enemy) => enemy.health > 0);
};

export const removeEnemiesPastCastle = (enemies: Enemy[]): Enemy[] => {
  return enemies.filter((enemy) => enemy.x > 50); // Castle is at x=50
};

export const damageEnemy = (
  enemy: Enemy,
  damage: number
): { enemy: Enemy; isDead: boolean } => {
  const newHealth = Math.max(0, enemy.health - damage);
  return {
    enemy: { ...enemy, health: newHealth },
    isDead: newHealth <= 0,
  };
};

export const damageCastle = (
  enemies: Enemy[],
  currentCastleHealth: number
): { castleHealth: number; enemies: Enemy[]; castleDestroyed: boolean } => {
  const enemiesAtCastle = enemies.filter((enemy) => enemy.x <= 50);
  const damage = enemiesAtCastle.length * 5; // 5 damage per enemy
  const newCastleHealth = Math.max(0, currentCastleHealth - damage);
  const castleDestroyed = newCastleHealth <= 0;

  // Remove enemies that reached the castle (unless castle is destroyed, then remove all)
  const remainingEnemies = castleDestroyed
    ? []
    : enemies.filter((enemy) => enemy.x > 50);

  return {
    castleHealth: newCastleHealth,
    enemies: remainingEnemies,
    castleDestroyed,
  };
};

export const handleCastleDestruction = (gameState: GameState): GameState => {
  return {
    ...gameState,
    gold: Math.floor(gameState.gold / 2), // Lose half gold
    enemies: [], // Clear all enemies
    castleHealth: 100, // Reset castle health
  };
};

export const createDefender = (
  x: number,
  y: number,
  defenderType: string
): Defender => {
  const defenderData = getDefenderData(defenderType);
  if (!defenderData) {
    throw new Error(`Unknown defender type: ${defenderType}`);
  }

  return {
    id: generateDefenderId(),
    type: defenderData.type,
    x,
    y,
    damage: defenderData.damage,
    attackSpeed: defenderData.attackSpeed,
    range: defenderData.range,
    lastAttack: 0,
    level: 1,
    cost: defenderData.cost,
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
    const predictedHealth = enemy.health - (predictedDamage.get(enemy.id) || 0);
    return predictedHealth > 0;
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
  return currentTime - defender.lastAttack >= 1000 / defender.attackSpeed;
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

export const generateArrowId = (): string => {
  return `arrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createArrow = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  currentTime: number,
  targetEnemyId?: string
): Arrow => {
  const distance = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  );
  const arrowSpeed = 300; // pixels per second
  const duration = (distance / arrowSpeed) * 1000; // Convert to milliseconds

  return {
    id: generateArrowId(),
    startX,
    startY,
    endX,
    endY,
    startTime: currentTime,
    duration,
    targetEnemyId, // Store the target enemy ID for precise targeting
  };
};

export const updateArrows = (arrows: Arrow[], currentTime: number): Arrow[] => {
  return arrows.filter((arrow) => {
    const elapsed = currentTime - arrow.startTime;
    return elapsed < arrow.duration;
  });
};

export const getArrowProgress = (arrow: Arrow, currentTime: number): number => {
  const elapsed = currentTime - arrow.startTime;
  return Math.min(elapsed / arrow.duration, 1);
};

export const processArrowImpacts = (
  arrows: Arrow[],
  enemies: Enemy[],
  defenders: Defender[],
  currentTime: number,
  predictedDamage: Map<string, number>
): {
  arrows: Arrow[];
  enemies: Enemy[];
  goldGained: number;
  goldPopups: GoldPopup[];
  predictedDamage: Map<string, number>;
} => {
  const activeArrows: Arrow[] = [];
  let updatedEnemies = [...enemies];
  let totalGoldGained = 0;
  const newGoldPopups: GoldPopup[] = [];
  const updatedPredictedDamage = new Map(predictedDamage);

  arrows.forEach((arrow) => {
    const progress = getArrowProgress(arrow, currentTime);

    if (progress >= 1) {
      // Arrow has reached its target
      let targetEnemy: Enemy | undefined;

      if (arrow.targetEnemyId) {
        // Use precise targeting if we have the target enemy ID
        targetEnemy = updatedEnemies.find(
          (enemy) => enemy.id === arrow.targetEnemyId
        );
      } else {
        // Fallback to proximity-based targeting
        targetEnemy = updatedEnemies.find((enemy) => {
          const distance = Math.sqrt(
            Math.pow(enemy.x + 20 - arrow.endX, 2) +
              Math.pow(enemy.y + 20 - arrow.endY, 2)
          );
          return distance < 30; // Within 30px of arrow end point
        });
      }

      if (targetEnemy) {
        // Find the defender that fired this arrow (closest to arrow start position)
        const firingDefender = defenders.find((defender) => {
          const distance = Math.sqrt(
            Math.pow(defender.x + 20 - arrow.startX, 2) +
              Math.pow(defender.y + 20 - arrow.startY, 2)
          );
          return distance < 30; // Within 30px of arrow start point
        });

        const damage = firingDefender?.damage || 1;
        const { enemy: damagedEnemy, isDead } = damageEnemy(
          targetEnemy,
          damage
        );

        // Reduce predicted damage since this arrow has hit
        const currentPredictedDamage =
          updatedPredictedDamage.get(targetEnemy.id) || 0;
        const newPredictedDamage = Math.max(0, currentPredictedDamage - damage);
        if (newPredictedDamage === 0) {
          updatedPredictedDamage.delete(targetEnemy.id);
        } else {
          updatedPredictedDamage.set(targetEnemy.id, newPredictedDamage);
        }

        updatedEnemies = updatedEnemies.map((enemy) =>
          enemy.id === targetEnemy.id ? damagedEnemy : enemy
        );

        if (isDead) {
          updatedEnemies = updatedEnemies.filter(
            (enemy) => enemy.id !== targetEnemy.id
          );
          // Remove predicted damage for dead enemies
          updatedPredictedDamage.delete(targetEnemy.id);
          const { goldGained, goldPopups: deathPopups } = handleEnemyDeath(
            targetEnemy,
            currentTime
          );
          totalGoldGained += goldGained;
          newGoldPopups.push(...deathPopups);
        }
      } else {
        // Arrow missed - reduce predicted damage for the target if we have one
        if (arrow.targetEnemyId) {
          const currentPredictedDamage =
            updatedPredictedDamage.get(arrow.targetEnemyId) || 0;
          const firingDefender = defenders.find((defender) => {
            const distance = Math.sqrt(
              Math.pow(defender.x + 20 - arrow.startX, 2) +
                Math.pow(defender.y + 20 - arrow.startY, 2)
            );
            return distance < 30;
          });
          const damage = firingDefender?.damage || 1;
          const newPredictedDamage = Math.max(
            0,
            currentPredictedDamage - damage
          );
          if (newPredictedDamage === 0) {
            updatedPredictedDamage.delete(arrow.targetEnemyId);
          } else {
            updatedPredictedDamage.set(arrow.targetEnemyId, newPredictedDamage);
          }
        }
      }
      // Arrow disappears after impact (don't add to activeArrows)
    } else {
      // Arrow still in flight, keep it active
      activeArrows.push(arrow);
    }
  });

  return {
    arrows: activeArrows,
    enemies: updatedEnemies,
    goldGained: totalGoldGained,
    goldPopups: newGoldPopups,
    predictedDamage: updatedPredictedDamage,
  };
};

export const handleEnemyDeath = (
  enemy: Enemy,
  currentTime: number
): { goldGained: number; goldPopups: GoldPopup[] } => {
  const goldGained = enemy.goldValue;
  const goldPopups: GoldPopup[] = [
    {
      id: `gold_${currentTime}_${Math.random()}`,
      x: enemy.x,
      y: enemy.y,
      amount: enemy.goldValue,
      startTime: currentTime,
    },
  ];

  return { goldGained, goldPopups };
};
