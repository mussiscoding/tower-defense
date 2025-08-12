import type {
  Defender,
  Enemy,
  Arrow,
  SkillContext,
} from "../../types/GameState";
import type { ElementType } from "../../data/elements";
import { getDefenderData } from "../../data/defenders";
import { createArrow } from "./arrow";
import { GAME_DIMENSIONS } from "../../constants/gameDimensions";
import type { ElementData } from "../../types/GameState";
import { calculateAnimationFrame } from "./animationUtils";
import {
  getBestActiveSkill,
  setSkillCooldown,
  getActiveSkillsForElement,
} from "../skillUtils";
import { calculatePredictedEnemyPosition } from "./uiUtils";

export const getBisectingDefenderPosition = (
  existingDefenders: Defender[]
): number => {
  const gameAreaHeight: number = GAME_DIMENSIONS.DEFENDER_SPAWN_Y_MAX;
  const gameAreaTop: number = GAME_DIMENSIONS.DEFENDER_SPAWN_Y_MIN;
  if (existingDefenders.length === 0) {
    // First defender: place randomly in the middle third
    const middleThirdStart = gameAreaTop + gameAreaHeight / 3;
    const middleThirdEnd = gameAreaTop + (2 * gameAreaHeight) / 3;
    return (
      Math.random() * (middleThirdEnd - middleThirdStart) + middleThirdStart
    );
  }

  // Get existing Y positions and sort them
  const existingYPositions = existingDefenders
    .map((d) => d.y)
    .sort((a, b) => a - b);

  // Find the largest gap between defenders
  let largestGap = 0;
  let gapStart = gameAreaTop;
  let gapEnd = gameAreaTop + gameAreaHeight;

  // Check gap before first defender
  const gapBeforeFirst = existingYPositions[0] - gameAreaTop;
  if (gapBeforeFirst > largestGap) {
    largestGap = gapBeforeFirst;
    gapStart = gameAreaTop;
    gapEnd = existingYPositions[0];
  }

  // Check gaps between defenders
  for (let i = 0; i < existingYPositions.length - 1; i++) {
    const gap = existingYPositions[i + 1] - existingYPositions[i];
    if (gap > largestGap) {
      largestGap = gap;
      gapStart = existingYPositions[i];
      gapEnd = existingYPositions[i + 1];
    }
  }

  // Check gap after last defender
  const gapAfterLast =
    gameAreaTop +
    gameAreaHeight -
    existingYPositions[existingYPositions.length - 1];
  if (gapAfterLast > largestGap) {
    largestGap = gapAfterLast;
    gapStart = existingYPositions[existingYPositions.length - 1];
    gapEnd = gameAreaTop + gameAreaHeight;
  }

  // Place new defender in the middle of the largest gap
  return gapStart + (gapEnd - gapStart) / 2;
};

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
    const distanceFromCastle = enemy.x - GAME_DIMENSIONS.CASTLE_WIDTH; // Castle is at x=75

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
    const nearestDistance = nearest.x - GAME_DIMENSIONS.CASTLE_WIDTH;
    const enemyDistance = enemy.x - GAME_DIMENSIONS.CASTLE_WIDTH;
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
  purchases: Record<string, number> = {},
  elements: Record<string, ElementData> = {}
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
    // Calculate animation frame for all defenders
    const frame = calculateAnimationFrame(defender, currentTime);

    if (!canDefenderAttack(defender, currentTime)) {
      return {
        ...defender,
        currentAnimationFrame: frame,
      };
    }

    const target = findNearestEnemy(
      defender,
      currentEnemies,
      updatedPredictedArrowDamage,
      updatedPredictedBurnDamage
    );
    if (!target) {
      return {
        ...defender,
        currentAnimationFrame: frame,
      };
    }

    // Calculate current damage based on element level
    const element = elements[defender.type];
    const currentDamage = element?.baseStats.damage || defender.damage;

    // Create a minimal context for skills to access
    const skillContext: SkillContext = {
      purchases,
      elements,
      enemies: currentEnemies,
      arrows: newArrows,
      splashEffects: [], // Not used in defender context
    };

    // Check for available active skills first (highest priority)
    const activeSkill = getBestActiveSkill(
      defender,
      purchases,
      currentTime,
      skillContext
    );

    if (activeSkill) {
      // Use active skill instead of normal attack
      console.log(
        `🎯 ${defender.type} using active skill: ${activeSkill.name}`
      );

      // Execute the active skill
      if (activeSkill.onAttack) {
        activeSkill.onAttack(defender, target, skillContext);

        // Set cooldown for this skill
        if (activeSkill.cooldown) {
          setSkillCooldown(
            defender,
            activeSkill.id,
            activeSkill.cooldown,
            currentTime
          );
        }
      }
    } else {
      // Normal attack with attack modifiers
      // Update predicted damage for this target
      const currentPredictedDamage =
        updatedPredictedArrowDamage.get(target.id) || 0;
      const newPredictedDamage = currentPredictedDamage + currentDamage;
      updatedPredictedArrowDamage.set(target.id, newPredictedDamage);

      // Calculate where the enemy will be when the arrow arrives
      const predictedPosition = calculatePredictedEnemyPosition(
        defender,
        target
      );

      // Get attack modifier skills for this defender
      const hitModifierSkills = getActiveSkillsForElement(
        defender.type,
        purchases,
        "attack_modifier"
      );
      const onHitEffects = hitModifierSkills.filter((skill) => skill.onHit);

      // Create arrow projectile with predicted target position and attached effects
      const arrow = createArrow(
        defender.x + 20, // Center of defender (defenders are still 40x40)
        defender.y + 20,
        predictedPosition.x,
        predictedPosition.y,
        currentTime,
        defender.type, // Element type of the defender
        target.id, // Store the target enemy ID for precise targeting
        onHitEffects // Attach skill effects to the arrow
      );

      newArrows.push(arrow);
    }

    return {
      ...defender,
      lastAttack: currentTime,
      currentAnimationFrame: frame,
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
