import type { Enemy, SkillContext } from "../../types/GameState";
import { SKILL_BASE_VALUES } from "../allSkills";
import { calculateSkillValue } from "../../utils/skills";

export const firePercentageDamageOnHit = (
  enemy: Enemy,
  damage: number,
  context: SkillContext
) => {
  // Only apply percentage damage to enemies that are NOT currently burning
  const currentTime = Date.now();
  const isBurning = !!(
    enemy.burnDamage &&
    enemy.burnEndTime &&
    currentTime < enemy.burnEndTime
  );

  // Skip percentage damage if enemy is already burning
  if (isBurning) {
    return;
  }

  // Calculate percentage damage using centralized skill value calculator
  const totalPercent = calculateSkillValue(
    SKILL_BASE_VALUES.FIRE_PERCENTAGE_DAMAGE,
    "fire_percentage_damage_upgrade",
    context.purchases
  );

  // Calculate percentage damage (% of enemy's health BEFORE the normal damage was applied)
  // Since onHit is called AFTER normal damage, we need to add the damage back to get original health
  const originalHealth = enemy.health + damage;
  const percentageDamage = Math.floor(originalHealth * (totalPercent / 100));

  // Apply additional percentage damage (beyond the normal damage that was already applied)
  const additionalDamage = Math.max(0, percentageDamage - damage);
  if (additionalDamage > 0) {
    enemy.health = Math.max(0, enemy.health - additionalDamage);
  }
};
