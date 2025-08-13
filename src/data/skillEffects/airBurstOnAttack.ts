import type { Defender, Enemy, SkillContext } from "../../types/GameState";
import { calculatePredictedEnemyPosition } from "../../utils/gameLogic/uiUtils";
import { getActiveSkillsForElement } from "../../utils/skillUtils";
import { createArrow } from "../../utils/gameLogic/arrow";

// Air Burst onAttack handler - fires multiple arrows at once
export const airBurstOnAttack = (
  defender: Defender,
  target: Enemy,
  context: SkillContext
) => {
  // Base burst values + upgrades
  const baseBurstShots = 2; // Matches elements.ts base value
  const shotUpgrades = context.purchases["air_burst_shots_upgrade"] || 0;
  const burstShots = baseBurstShots + shotUpgrades;

  const burstDelay = 50;
  const currentTime = Date.now();

  const predictedPosition = calculatePredictedEnemyPosition(defender, target);

  const hitModifierSkills = getActiveSkillsForElement(
    defender.type,
    context.purchases,
    "attack_modifier"
  );
  const onHitEffects = hitModifierSkills.filter((skill) => skill.onHit);

  for (let i = 0; i < burstShots; i++) {
    const spreadOffset = (i - Math.floor(burstShots / 2)) * 10;

    const arrow = createArrow(
      defender.x + 20,
      defender.y + 20,
      predictedPosition.x + spreadOffset,
      predictedPosition.y,
      currentTime + i * burstDelay,
      defender.type,
      target.id,
      onHitEffects
    );

    context.arrows.push(arrow);
  }
};
