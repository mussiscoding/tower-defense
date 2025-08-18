import type { Enemy, SkillContext } from "../../types/GameState";
import { SKILL_BASE_VALUES } from "../allSkills";
import { calculateSkillValue } from "../../utils/skills";

export const airCriticalHitOnHit = (
  enemy: Enemy,
  damage: number,
  context: SkillContext
) => {
  // Calculate critical hit chance using centralized skill value calculator
  const criticalHitChance = calculateSkillValue(
    SKILL_BASE_VALUES.AIR_CRITICAL_HIT_CHANCE,
    "air_critical_hit_chance_upgrade",
    context.purchases
  );

  // Check if this hit is a critical hit
  const randomValue = Math.random() * 100;
  if (randomValue <= criticalHitChance) {
    // Critical hit! Apply damage multiplier
    // Starting at 1.5x, increasing by 0.5x per upgrade
    const baseMultiplier = SKILL_BASE_VALUES.AIR_CRITICAL_HIT_MULTIPLIER;
    const upgradeCount =
      context.purchases["air_critical_hit_chance_upgrade"] || 0;
    const damageMultiplier = baseMultiplier + upgradeCount * 0.5;

    const criticalDamage = Math.floor(damage * damageMultiplier);
    const additionalDamage = criticalDamage - damage;

    if (additionalDamage > 0) {
      enemy.health = Math.max(0, enemy.health - additionalDamage);

      // Add total critical damage to the skill context for visual effects
      context.bonusDamage.push({
        amount: criticalDamage, // Total damage (base + bonus), not just bonus
        x: enemy.x + 20, // Center of enemy
        y: enemy.y - 10, // Above enemy
        elementType: "air",
      });
    }
  }
};
