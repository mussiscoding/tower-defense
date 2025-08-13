import type { Enemy, SkillContext } from "../../types/GameState";
import { SKILL_BASE_VALUES } from "../allSkills";
import { calculateSkillValue } from "../../utils/skills";

// Ice Slow onHit handler - applies slow effect to enemies
export const iceSlowOnHit = (
  enemy: Enemy,
  _damage: number,
  context: SkillContext
) => {
  // Calculate slow effect percentage using centralized skill value calculator
  const slowEffectPercent = calculateSkillValue(
    SKILL_BASE_VALUES.ICE_SLOW_EFFECT,
    "ice_slow_effect_upgrade",
    context.purchases
  );

  const slowDuration = 3000; // 3 seconds in milliseconds
  const currentTime = Date.now();

  // Apply slow effect to enemy
  enemy.slowEffect = slowEffectPercent;
  enemy.slowEndTime = currentTime + slowDuration;
};
