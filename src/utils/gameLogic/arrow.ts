import type {
  Arrow,
  Enemy,
  GoldPopup,
  SplashEffect,
  ElementData,
  DamageNumber,
  SkillContext,
  Skill,
} from "../../types/GameState";
import type { ElementType } from "../../data/elements";
import { damageEnemy, handleEnemyDeath } from "./enemy";
import { grantElementXP } from "./mutations";
import { createDamageNumber } from "./uiUtils";
import { GAME_MECHANICS } from "../../constants/gameDimensions";

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
  targetEnemyId?: string,
  onHitEffects?: Skill[]
): Arrow => {
  const distance = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  );
  const duration = (distance / GAME_MECHANICS.ARROW_SPEED) * 1000;

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
    onHitEffects,
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
  damageNumbers: DamageNumber[];
} => {
  const activeArrows: Arrow[] = [];
  let updatedEnemies = [...enemies];
  let totalGoldGained = 0;
  const newGoldPopups: GoldPopup[] = [];
  const newSplashEffects: SplashEffect[] = [];
  const updatedPredictedArrowDamage = new Map(predictedArrowDamage);
  const updatedPredictedBurnDamage = new Map(predictedBurnDamage);
  const updatedElements = {
    fire: { ...elements.fire },
    ice: { ...elements.ice },
    earth: { ...elements.earth },
    air: { ...elements.air },
  };
  const processedArrowIds = new Set<string>();
  const newDamageNumbers: DamageNumber[] = [];

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
          grantElementXP(updatedElements, arrow.elementType, damage);
        }

        // Reduce predicted damage since this arrow has hit
        const currentPredictedDamage =
          updatedPredictedArrowDamage.get(targetEnemy.id) || 0;
        const newPredictedDamage = Math.max(0, currentPredictedDamage - damage);

        // Update predicted damage
        if (newPredictedDamage === 0) {
          updatedPredictedArrowDamage.delete(targetEnemy.id);
        } else {
          updatedPredictedArrowDamage.set(targetEnemy.id, newPredictedDamage);
        }

        // Execute onHit effects from attached skills
        const finalEnemy = damagedEnemy;
        if (arrow.onHitEffects && arrow.onHitEffects.length > 0) {
          const skillContext: SkillContext = {
            purchases,
            elements: updatedElements,
            enemies: updatedEnemies,
            arrows: activeArrows,
            splashEffects: [],
            bonusDamage: [],
            vortexes: [],
          };

          // Execute all onHit effects
          arrow.onHitEffects.forEach((skill) => {
            if (skill.onHit) {
              skill.onHit(finalEnemy, damage, skillContext);
            }
          });

          // Collect splash effects created by skills
          newSplashEffects.push(...skillContext.splashEffects);

          // Create damage numbers for bonus damage from skills
          skillContext.bonusDamage.forEach((bonus) => {
            const bonusDamageNumber = createDamageNumber(
              bonus.amount,
              bonus.x,
              bonus.y,
              bonus.elementType,
              currentTime,
              true
            );
            newDamageNumbers.push(bonusDamageNumber);
          });

          // Create damage number for base damage (only if no bonus damage)
          if (damage > 1 && !skillContext.bonusDamage.length) {
            const damageNumber = createDamageNumber(
              damage,
              targetEnemy.x + 20, // Center of enemy
              targetEnemy.y - 10, // Above enemy
              arrow.elementType,
              currentTime,
              false
            );
            newDamageNumbers.push(damageNumber);
          }
        } else {
          // No onHit effects, create base damage number
          if (damage > 1) {
            const damageNumber = createDamageNumber(
              damage,
              targetEnemy.x + 20, // Center of enemy
              targetEnemy.y - 10, // Above enemy
              arrow.elementType,
              currentTime,
              false
            );
            newDamageNumbers.push(damageNumber);
          }
        }

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
    damageNumbers: newDamageNumbers,
  };
};
