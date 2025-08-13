import type { Enemy, SkillContext } from "../../types/GameState";
import { allUpgrades } from "../upgrades";

// Helper function to get upgrade amount for a specific upgrade
const getUpgradeAmount = (upgradeId: string): number => {
  const upgrade = allUpgrades.find((item) => item.id === upgradeId);
  return upgrade?.upgradeAmount || 1; // fallback to 1 if not found
};

// Ice Slow onHit handler - applies slow effect to enemies
export const iceSlowOnHit = (
  enemy: Enemy,
  _damage: number,
  context: SkillContext
) => {
  // Base slow effect percentage + upgrades
  const baseSlowPercent = 5; // Matches elements.ts base value
  const slowUpgrades = context.purchases["ice_slow_effect_upgrade"] || 0;
  const slowUpgradeAmount = getUpgradeAmount("ice_slow_effect_upgrade");
  const slowEffectPercent = baseSlowPercent + slowUpgrades * slowUpgradeAmount;

  const slowDuration = 3000; // 3 seconds in milliseconds
  const currentTime = Date.now();

  // Apply slow effect to enemy
  enemy.slowEffect = slowEffectPercent;
  enemy.slowEndTime = currentTime + slowDuration;
};
