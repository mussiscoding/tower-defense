import type { Enemy, SkillContext } from "../../types/GameState";
import { SKILL_BASE_VALUES } from "../allSkills";
import { calculateSkillValue } from "../../utils/skills";

export const fireBurnOnHit = (
  enemy: Enemy,
  damage: number,
  context: SkillContext
) => {
  // Calculate burn damage percentage using centralized skill value calculator
  const burnDamagePercent = calculateSkillValue(
    SKILL_BASE_VALUES.FIRE_BURN_DAMAGE,
    "fire_burn_damage_upgrade",
    context.purchases
  );

  const burnDuration = 2000; // 2 seconds in milliseconds
  const currentTime = Date.now();

  // Calculate burn damage as percentage of arrow damage
  const burnDamage = Math.floor((damage * burnDamagePercent) / 100);

  // Apply burn effect to enemy
  enemy.burnDamage = burnDamage;
  enemy.burnEndTime = currentTime + burnDuration;
};
