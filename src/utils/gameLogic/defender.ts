import type {
  Defender,
  Enemy,
  Arrow,
  SkillContext,
  VortexData,
} from "../../types/GameState";
import type { ElementType } from "../../data/elements";
import { getDefenderData } from "../../data/defenders";
import { createArrow } from "./arrow";

import type { ElementData } from "../../types/GameState";
import { calculateAnimationFrame } from "./animationUtils";
import {
  getBestActiveSkill,
  setSkillCooldown,
  getActiveSkillsForElement,
} from "../skillUtils";
import { calculatePredictedEnemyPosition } from "./uiUtils";
import { findNearestEnemy, findBestSplashEnemy } from "./targeting";
import { SKILL_BASE_VALUES } from "../../data/allSkills";
import { calculateSkillValue } from "../skills";

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

export const canDefenderAttack = (
  defender: Defender,
  currentTime: number,
  attackSpeedMultiplier: number = 1
): boolean => {
  return currentTime - defender.lastAttack > 1000 / (defender.attackSpeed * attackSpeedMultiplier);
};

export const updateDefenders = (
  defenders: Defender[],
  enemies: Enemy[],
  currentTime: number,
  predictedArrowDamage: Map<string, number>,
  predictedBurnDamage: Map<string, number>,
  purchases: Record<string, number> = {},
  elements: Record<string, ElementData> = {},
  attackSpeedMultiplier: number = 1
): {
  defenders: Defender[];
  enemies: Enemy[];
  arrows: Arrow[];
  predictedArrowDamage: Map<string, number>;
  predictedBurnDamage: Map<string, number>;
  vortexes: VortexData[];
} => {
  const currentEnemies = [...enemies];
  const newArrows: Arrow[] = [];
  const updatedPredictedArrowDamage = new Map(predictedArrowDamage);
  const updatedPredictedBurnDamage = new Map(predictedBurnDamage);
  const newVortexes: VortexData[] = []; // Collect vortexes from skills

  const updatedDefenders = defenders.map((defender) => {
    // Calculate animation frame for all defenders
    const frame = calculateAnimationFrame(defender, currentTime);

    if (!canDefenderAttack(defender, currentTime, attackSpeedMultiplier)) {
      return {
        ...defender,
        currentAnimationFrame: frame,
      };
    }

    // Use Earth-specific targeting for Earth defenders only if they have the Smart Targeting skill
    const target =
      defender.type === "earth" && (purchases["earth_smart_targeting"] || 0) > 0
        ? findBestSplashEnemy(
            defender,
            currentEnemies,
            updatedPredictedArrowDamage,
            updatedPredictedBurnDamage,
            calculateSkillValue(
              SKILL_BASE_VALUES.EARTH_SPLASH_RADIUS,
              "earth_splash_radius_upgrade",
              purchases
            )
          )
        : findNearestEnemy(
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
      bonusDamage: [], // Not used in defender context
      vortexes: [],
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

        // Collect vortexes created by the skill
        if (skillContext.vortexes && skillContext.vortexes.length > 0) {
          newVortexes.push(...skillContext.vortexes);
        }

        // Set cooldown for this skill
        if (activeSkill.cooldown) {
          setSkillCooldown(defender, activeSkill.id, purchases, currentTime);
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
    vortexes: newVortexes, // Return collected vortexes from skills
  };
};
