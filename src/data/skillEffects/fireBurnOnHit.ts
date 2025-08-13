import type { Enemy, SkillContext } from "../../types/GameState";

export const fireBurnOnHit = (
  enemy: Enemy,
  damage: number,
  context: SkillContext
) => {
  // Base burn damage percentage + upgrades
  const baseBurnPercent = 20;
  const burnUpgrades = context.purchases["fire_burn_damage_upgrade"] || 0;
  const burnDamagePercent = baseBurnPercent + burnUpgrades;

  const burnDuration = 2000; // 2 seconds in milliseconds
  const currentTime = Date.now();

  // Calculate burn damage as percentage of arrow damage
  const burnDamage = Math.floor((damage * burnDamagePercent) / 100);

  // Apply burn effect to enemy
  enemy.burnDamage = burnDamage;
  enemy.burnEndTime = currentTime + burnDuration;
};
