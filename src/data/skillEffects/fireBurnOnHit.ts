import type { Enemy, SkillContext } from "../../types/GameState";
import { allUpgrades } from "../upgrades";

// Helper function to get upgrade amount for a specific upgrade
const getUpgradeAmount = (upgradeId: string): number => {
  const upgrade = allUpgrades.find((item) => item.id === upgradeId);
  return upgrade?.upgradeAmount || 1; // fallback to 1 if not found
};

export const fireBurnOnHit = (
  enemy: Enemy,
  damage: number,
  context: SkillContext
) => {
  // Base burn damage percentage + upgrades
  const baseBurnPercent = 20;
  const burnUpgrades = context.purchases["fire_burn_damage_upgrade"] || 0;
  const burnUpgradeAmount = getUpgradeAmount("fire_burn_damage_upgrade");
  const burnDamagePercent = baseBurnPercent + burnUpgrades * burnUpgradeAmount;

  const burnDuration = 2000; // 2 seconds in milliseconds
  const currentTime = Date.now();

  // Calculate burn damage as percentage of arrow damage
  const burnDamage = Math.floor((damage * burnDamagePercent) / 100);

  // Apply burn effect to enemy
  enemy.burnDamage = burnDamage;
  enemy.burnEndTime = currentTime + burnDuration;
};
