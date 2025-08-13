import type { Enemy, SkillContext } from "../../types/GameState";

// Ice Slow onHit handler - applies slow effect to enemies
export const iceSlowOnHit = (
  enemy: Enemy,
  _damage: number,
  context: SkillContext
) => {
  // Base slow effect percentage + upgrades
  const baseSlowPercent = 5; // Matches elements.ts base value
  const slowUpgrades = context.purchases["ice_slow_effect_upgrade"] || 0;
  const slowEffectPercent = baseSlowPercent + slowUpgrades;

  const slowDuration = 3000; // 3 seconds in milliseconds
  const currentTime = Date.now();

  // Apply slow effect to enemy
  enemy.slowEffect = slowEffectPercent;
  enemy.slowEndTime = currentTime + slowDuration;
};
