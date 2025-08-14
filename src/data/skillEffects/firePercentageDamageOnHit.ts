import type { Enemy, SkillContext } from "../../types/GameState";
import { SKILL_BASE_VALUES } from "../allSkills";
import { calculateSkillValue } from "../../utils/skills";

export const firePercentageDamageOnHit = (
  enemy: Enemy,
  damage: number,
  context: SkillContext
) => {
  // Only apply percentage damage to enemies that were NOT burning before this hit
  // If enemy has burn that expires in exactly 2000ms from now, it was just applied by the burn skill
  const currentTime = Date.now();
  const wasJustBurned = !!(
    (
      enemy.burnDamage &&
      enemy.burnEndTime &&
      Math.abs(enemy.burnEndTime - (currentTime + 2000)) < 50
    ) // Within 50ms of exactly 2s from now
  );

  // If enemy wasn't burning before OR was just burned by this same attack, apply percentage damage
  const wasBurningBefore = !!(
    enemy.burnDamage &&
    enemy.burnEndTime &&
    !wasJustBurned
  );

  if (wasBurningBefore) {
    return;
  }

  const totalPercent = calculateSkillValue(
    SKILL_BASE_VALUES.FIRE_PERCENTAGE_DAMAGE,
    "fire_percentage_damage_upgrade",
    context.purchases
  );

  const originalHealth = enemy.health + damage;
  const percentageDamage = Math.floor(originalHealth * (totalPercent / 100));

  const additionalDamage = Math.max(0, percentageDamage - damage);
  if (additionalDamage > 0) {
    enemy.health = Math.max(0, enemy.health - additionalDamage);
  }
};
