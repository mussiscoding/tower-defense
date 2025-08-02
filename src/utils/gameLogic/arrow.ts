import type {
  Arrow,
  Enemy,
  ElementData,
  GoldPopup,
} from "../../types/GameState";
import type { ElementType } from "../../data/elements";
import {
  calculateElementAbilities,
  calculateElementStats,
  getLevelFromXP,
} from "../../data/elements";
import { addElementEffects } from "../elementEffects";
import { damageEnemy, handleEnemyDeath } from "./enemy";

export const generateArrowId = (): string => {
  return `arrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createArrow = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  currentTime: number,
  elementType: ElementType,
  targetEnemyId?: string
): Arrow => {
  const distance = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  );
  const duration = (distance / 300) * 1000; // 300 pixels per second

  return {
    id: generateArrowId(),
    startX,
    startY,
    endX,
    endY,
    startTime: currentTime,
    duration,
    targetEnemyId,
    elementType,
  };
};

export const updateArrows = (arrows: Arrow[], currentTime: number): Arrow[] => {
  return arrows.filter((arrow) => {
    const progress = getArrowProgress(arrow, currentTime);
    return progress < 1;
  });
};

export const getArrowProgress = (arrow: Arrow, currentTime: number): number => {
  const elapsed = currentTime - arrow.startTime;
  return Math.min(elapsed / arrow.duration, 1);
};

export const processArrowImpacts = (
  arrows: Arrow[],
  enemies: Enemy[],
  currentTime: number,
  predictedDamage: Map<string, number>,
  elements: Record<ElementType, ElementData>,
  purchases: Record<string, number>
): {
  arrows: Arrow[];
  enemies: Enemy[];
  goldGained: number;
  goldPopups: GoldPopup[];
  predictedDamage: Map<string, number>;
  elements: Record<ElementType, ElementData>;
} => {
  const activeArrows: Arrow[] = [];
  let updatedEnemies = [...enemies];
  let totalGoldGained = 0;
  const newGoldPopups: GoldPopup[] = [];
  const updatedPredictedDamage = new Map(predictedDamage);
  const updatedElements = { ...elements };
  const processedArrowIds = new Set<string>();

  arrows.forEach((arrow) => {
    // Skip if this arrow has already been processed
    if (processedArrowIds.has(arrow.id)) {
      return;
    }

    const progress = getArrowProgress(arrow, currentTime);

    if (progress >= 1) {
      // Arrow has reached its target
      processedArrowIds.add(arrow.id); // Mark as processed
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
        // Get damage from the element's current stats
        const element = updatedElements[arrow.elementType];
        const damage = element?.baseStats.damage || 1;
        const { enemy: damagedEnemy, isDead } = damageEnemy(
          targetEnemy,
          damage
        );

        // Grant XP to elements based on damage dealt (1 damage = 1 XP)
        if (element) {
          element.xp += damage;
          element.totalDamage += damage;

          // Check for level up
          const newLevel = getLevelFromXP(element.xp);
          if (newLevel > element.level) {
            element.level = newLevel;
            // Update stats based on new level
            element.baseStats = calculateElementStats(
              arrow.elementType,
              newLevel
            );
          }
        }

        // Reduce predicted damage since this arrow has hit
        const currentPredictedDamage =
          updatedPredictedDamage.get(targetEnemy.id) || 0;
        const newPredictedDamage = Math.max(0, currentPredictedDamage - damage);

        // For fire arrows, also add burn damage to predicted damage
        if (
          arrow.elementType === "fire" &&
          targetEnemy.burnDamage &&
          targetEnemy.burnEndTime
        ) {
          const burnDamagePerTick = targetEnemy.burnDamage;
          const burnDuration = (targetEnemy.burnEndTime - currentTime) / 1000; // Duration in seconds
          const totalBurnTicks = Math.floor(burnDuration * 2); // 2 ticks per second
          const totalBurnDamage = burnDamagePerTick * totalBurnTicks;

          // Add burn damage to predicted damage
          const totalPredictedDamage = newPredictedDamage + totalBurnDamage;
          updatedPredictedDamage.set(targetEnemy.id, totalPredictedDamage);
        } else {
          if (newPredictedDamage === 0) {
            updatedPredictedDamage.delete(targetEnemy.id);
          } else {
            updatedPredictedDamage.set(targetEnemy.id, newPredictedDamage);
          }
        }

        // Apply element effects
        const elementAbilities = calculateElementAbilities(
          arrow.elementType,
          purchases
        );
        const { enemy: finalEnemy, logMessage } = addElementEffects(
          damagedEnemy,
          arrow.elementType,
          elementAbilities,
          currentTime
        );

        if (logMessage) {
          console.log(logMessage);
        }

        updatedEnemies = updatedEnemies.map((enemy) =>
          enemy.id === targetEnemy.id ? finalEnemy : enemy
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
          // Get damage from the element's current stats
          const element = updatedElements[arrow.elementType];
          const damage = element?.baseStats.damage || 1;
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
    elements: updatedElements,
  };
};
