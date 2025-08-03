import type {
  Arrow,
  Enemy,
  ElementData,
  GoldPopup,
  SplashEffect,
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

export const generateSplashEffectId = (): string => {
  return `splash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

export const createSplashEffect = (
  centerX: number,
  centerY: number,
  radius: number,
  currentTime: number
): SplashEffect => {
  return {
    id: generateSplashEffectId(),
    centerX,
    centerY,
    radius,
    startTime: currentTime,
    duration: 300, // 0.3 seconds duration for faster splash effect
  };
};

export const processArrowImpacts = (
  arrows: Arrow[],
  enemies: Enemy[],
  currentTime: number,
  predictedArrowDamage: Map<string, number>,
  predictedBurnDamage: Map<string, number>,
  elements: Record<ElementType, ElementData>,
  purchases: Record<string, number>
): {
  arrows: Arrow[];
  enemies: Enemy[];
  goldGained: number;
  goldPopups: GoldPopup[];
  splashEffects: SplashEffect[];
  predictedArrowDamage: Map<string, number>;
  predictedBurnDamage: Map<string, number>;
  elements: Record<ElementType, ElementData>;
} => {
  const activeArrows: Arrow[] = [];
  let updatedEnemies = [...enemies];
  let totalGoldGained = 0;
  const newGoldPopups: GoldPopup[] = [];
  const newSplashEffects: SplashEffect[] = [];
  const updatedPredictedArrowDamage = new Map(predictedArrowDamage);
  const updatedPredictedBurnDamage = new Map(predictedBurnDamage);
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
          updatedPredictedArrowDamage.get(targetEnemy.id) || 0;
        const newPredictedDamage = Math.max(0, currentPredictedDamage - damage);

        // Log arrow impact and predicted damage reduction
        console.log(
          `💥 Arrow hit enemy ${targetEnemy.id} (${targetEnemy.type}):`,
          {
            damageDealt: damage,
            currentPredicted: currentPredictedDamage,
            newPredicted: newPredictedDamage,
            enemyHealthBefore: targetEnemy.health,
            enemyHealthAfter: damagedEnemy.health,
            isDead: isDead,
          }
        );

        // Update predicted damage
        if (newPredictedDamage === 0) {
          updatedPredictedArrowDamage.delete(targetEnemy.id);
        } else {
          updatedPredictedArrowDamage.set(targetEnemy.id, newPredictedDamage);
        }

        // Handle burn damage for fire arrows
        if (arrow.elementType === "fire") {
          const elementAbilities = calculateElementAbilities(
            arrow.elementType,
            purchases
          );
          const burnDamage = elementAbilities.burnDamage || 0;
          const burnDuration = elementAbilities.burnDuration || 0;

          if (burnDamage > 0 && burnDuration > 0) {
            // Calculate total burn damage (damage per tick * number of ticks)
            const burnTickInterval = 500; // 500ms per tick
            const totalBurnTicks = Math.floor(
              (burnDuration * 1000) / burnTickInterval
            );
            const totalBurnDamage = burnDamage * totalBurnTicks;

            // Replace existing burn damage prediction with new one
            updatedPredictedBurnDamage.set(targetEnemy.id, totalBurnDamage);
          }
        }

        // Apply element effects
        const elementAbilities = calculateElementAbilities(
          arrow.elementType,
          purchases
        );
        const { enemy: finalEnemy } = addElementEffects(
          damagedEnemy,
          arrow.elementType,
          elementAbilities,
          currentTime
        );

        updatedEnemies = updatedEnemies.map((enemy) =>
          enemy.id === targetEnemy.id ? finalEnemy : enemy
        );

        if (isDead) {
          updatedEnemies = updatedEnemies.filter(
            (enemy) => enemy.id !== targetEnemy.id
          );
          // Remove predicted damage for dead enemies
          updatedPredictedArrowDamage.delete(targetEnemy.id);
          updatedPredictedBurnDamage.delete(targetEnemy.id);
          const { goldGained, goldPopups: deathPopups } = handleEnemyDeath(
            targetEnemy,
            currentTime
          );
          totalGoldGained += goldGained;
          newGoldPopups.push(...deathPopups);
        }
      }

      // Handle splash damage for earth arrows (regardless of target status)
      if (arrow.elementType === "earth") {
        const elementAbilities = calculateElementAbilities(
          arrow.elementType,
          purchases
        );
        const splashDamagePercent = elementAbilities.splashDamage || 0; // 20 = 20%
        const splashRadius = elementAbilities.splashRadius || 0;

        // Calculate actual splash damage based on arrow damage
        const element = updatedElements[arrow.elementType];
        const arrowDamage = element?.baseStats.damage || 15;
        const splashDamage = Math.floor(
          (arrowDamage * splashDamagePercent) / 100
        );

        if (splashDamage > 0 && splashRadius > 0) {
          // Use target position for splash center (even if target is dead)
          const splashCenterX = targetEnemy ? targetEnemy.x : arrow.endX - 20;
          const splashCenterY = targetEnemy ? targetEnemy.y : arrow.endY - 20;

          // Find enemies within splash radius
          const splashTargets = updatedEnemies.filter((enemy) => {
            const distance = Math.sqrt(
              Math.pow(enemy.x - splashCenterX, 2) +
                Math.pow(enemy.y - splashCenterY, 2)
            );
            return (
              distance <= splashRadius &&
              (!targetEnemy || enemy.id !== targetEnemy.id)
            );
          });

          // Apply splash damage immediately (no predicted damage reduction)
          let totalSplashDamage = 0;
          splashTargets.forEach((enemy) => {
            // Apply actual splash damage
            const { enemy: damagedEnemy, isDead } = damageEnemy(
              enemy,
              splashDamage
            );

            // Track total splash damage for XP
            totalSplashDamage += splashDamage;

            // Update enemy state
            updatedEnemies = updatedEnemies.map((e) =>
              e.id === enemy.id ? damagedEnemy : e
            );

            // Handle enemy death from splash damage
            if (isDead) {
              updatedEnemies = updatedEnemies.filter((e) => e.id !== enemy.id);
              // Remove predicted damage for dead enemies
              updatedPredictedArrowDamage.delete(enemy.id);
              updatedPredictedBurnDamage.delete(enemy.id);

              const { goldGained, goldPopups: deathPopups } = handleEnemyDeath(
                enemy,
                currentTime
              );
              totalGoldGained += goldGained;
              newGoldPopups.push(...deathPopups);
            }
          });

          // Create splash effect for visual feedback
          const splashEffect = createSplashEffect(
            splashCenterX + 20, // Center of splash
            splashCenterY + 20,
            splashRadius,
            currentTime
          );

          // Add splash effect to new splash effects
          newSplashEffects.push(splashEffect);

          // Grant XP for splash damage
          if (totalSplashDamage > 0 && element) {
            element.xp += totalSplashDamage;
            element.totalDamage += totalSplashDamage;

            // Check for level up from splash damage
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

          console.log(
            `🌍 Earth arrow: Applied ${splashDamage} splash damage to ${splashTargets.length} enemies (${totalSplashDamage} total splash damage) with radius ${splashRadius}`
          );
        }
      } else {
        // Arrow missed - reduce predicted damage for the target if we have one
        if (arrow.targetEnemyId) {
          const currentPredictedDamage =
            updatedPredictedArrowDamage.get(arrow.targetEnemyId) || 0;
          // Get damage from the element's current stats
          const element = updatedElements[arrow.elementType];
          const damage = element?.baseStats.damage || 1;
          const newPredictedDamage = Math.max(
            0,
            currentPredictedDamage - damage
          );
          if (newPredictedDamage === 0) {
            updatedPredictedArrowDamage.delete(arrow.targetEnemyId);
          } else {
            updatedPredictedArrowDamage.set(
              arrow.targetEnemyId,
              newPredictedDamage
            );
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
    splashEffects: newSplashEffects,
    predictedArrowDamage: updatedPredictedArrowDamage,
    predictedBurnDamage: updatedPredictedBurnDamage,
    elements: updatedElements,
  };
};
