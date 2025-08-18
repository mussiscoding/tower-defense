import type { Enemy, SkillContext } from "../../types/GameState";
import { SKILL_BASE_VALUES } from "../allSkills";
import { calculateSkillValue } from "../../utils/skills";

export const airCriticalHitOnHit = (
  enemy: Enemy,
  damage: number,
  context: SkillContext
) => {
  // Calculate critical hit chance using centralized skill value calculator
  const criticalHitChance = SKILL_BASE_VALUES.AIR_CRITICAL_HIT_CHANCE;

  // Check if this hit is a critical hit
  const randomValue = Math.random() * 100;
  if (randomValue <= criticalHitChance) {
    const damageMultiplier = calculateSkillValue(
      SKILL_BASE_VALUES.AIR_CRITICAL_HIT_MULTIPLIER,
      "air_critical_hit_damage_upgrade",
      context.purchases
    );

    const criticalDamage = Math.floor(damage * damageMultiplier);
    console.log("criticalDamage", criticalDamage);
    const additionalDamage = criticalDamage - damage;

    if (additionalDamage > 0) {
      enemy.health = Math.max(0, enemy.health - additionalDamage);

      context.bonusDamage.push({
        amount: criticalDamage,
        x: enemy.x + 20,
        y: enemy.y - 10,
        elementType: "air",
      });
    }
  }
};
