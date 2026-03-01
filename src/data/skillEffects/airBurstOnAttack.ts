import type { Defender, Enemy, SkillContext } from "../../types/GameState";
import { calculatePredictedEnemyPosition } from "../../utils/gameLogic/uiUtils";
import { getActiveSkillsForElement } from "../../utils/skillUtils";
import { createArrow } from "../../utils/gameLogic/arrow";
import { GAME_DIMENSIONS } from "../../constants/gameDimensions";
import { SKILL_BASE_VALUES } from "../allSkills";
import { calculateSkillValue } from "../../utils/skills";

// Air Burst onAttack handler - fires arrows at multiple enemies
export const airBurstOnAttack = (
  defender: Defender,
  target: Enemy,
  context: SkillContext
) => {
  // Calculate burst shots using centralized skill value calculator
  const burstShots = calculateSkillValue(
    SKILL_BASE_VALUES.AIR_BURST_SHOTS,
    "air_burst_shots_upgrade",
    context.purchases
  );

  const burstDelay = 50;
  const currentTime = Date.now();

  const hitModifierSkills = getActiveSkillsForElement(
    defender.type,
    context.purchases,
    "attack_modifier"
  );
  const onHitEffects = hitModifierSkills.filter((skill) => skill.onHit);

  // Get current damage for predicted damage tracking
  const element = context.elements[defender.type];
  const currentDamage = element?.baseStats.damage || 1;

  // Pick up to burstShots distinct enemies, sorted by proximity to castle
  // Filter out enemies predicted to die from existing damage
  const enemiesInRange = context.enemies
    .filter((e) => {
      if (e.health <= 0) return false;
      if (e.x - GAME_DIMENSIONS.CASTLE_WIDTH > defender.range) return false;
      const predictedDmg =
        (context.predictedArrowDamage.get(e.id) || 0) +
        (context.predictedBurnDamage.get(e.id) || 0);
      return e.health - predictedDmg > 0;
    })
    .sort((a, b) => a.x - b.x);

  // Start with original target if it's still worth shooting
  const targets: Enemy[] = [];
  const targetPredictedDmg =
    (context.predictedArrowDamage.get(target.id) || 0) +
    (context.predictedBurnDamage.get(target.id) || 0);
  if (target.health - targetPredictedDmg > 0) {
    targets.push(target);
  }

  for (const enemy of enemiesInRange) {
    if (targets.length >= burstShots) break;
    if (!targets.some((t) => t.id === enemy.id)) {
      targets.push(enemy);
    }
  }

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];

    // Update predicted damage so other defenders/burst arrows don't overkill
    const current = context.predictedArrowDamage.get(t.id) || 0;
    context.predictedArrowDamage.set(t.id, current + currentDamage);

    const predictedPosition = calculatePredictedEnemyPosition(defender, t);

    const arrow = createArrow(
      defender.x + 20,
      defender.y + 20,
      predictedPosition.x,
      predictedPosition.y,
      currentTime + i * burstDelay,
      defender.type,
      t.id,
      onHitEffects
    );

    context.arrows.push(arrow);
  }
};
