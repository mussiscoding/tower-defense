import type { Enemy, SkillContext } from "../../types/GameState";
import { createSplashEffect } from "../../utils/gameLogic/arrow";
import { allUpgrades } from "../upgrades";

// Helper function to get upgrade amount for a specific upgrade
const getUpgradeAmount = (upgradeId: string): number => {
  const upgrade = allUpgrades.find((item) => item.id === upgradeId);
  return upgrade?.upgradeAmount || 1; // fallback to 1 if not found
};

// Earth Splash onHit handler - applies splash damage to nearby enemies
export const earthSplashOnHit = (
  enemy: Enemy,
  damage: number,
  context: SkillContext
) => {
  // Base splash values + upgrades
  const baseSplashPercent = 20;
  const splashDamageUpgrades =
    context.purchases["earth_splash_damage_upgrade"] || 0;
  const splashDamageUpgradeAmount = getUpgradeAmount(
    "earth_splash_damage_upgrade"
  );
  const splashDamagePercent =
    baseSplashPercent + splashDamageUpgrades * splashDamageUpgradeAmount;

  const baseRadius = 50;
  const radiusUpgrades = context.purchases["earth_splash_radius_upgrade"] || 0;
  const radiusUpgradeAmount = getUpgradeAmount("earth_splash_radius_upgrade");
  const splashRadius = baseRadius + radiusUpgrades * radiusUpgradeAmount; // Dynamic upgrade amount

  // Find nearby enemies within splash radius
  const nearbyEnemies = context.enemies.filter((otherEnemy) => {
    if (otherEnemy.id === enemy.id) return false;

    const distance = Math.sqrt(
      Math.pow(otherEnemy.x - enemy.x, 2) + Math.pow(otherEnemy.y - enemy.y, 2)
    );
    return distance <= splashRadius;
  });

  // Apply splash damage to nearby enemies
  const splashDamage = Math.floor((damage * splashDamagePercent) / 100);
  nearbyEnemies.forEach((nearbyEnemy) => {
    nearbyEnemy.health = Math.max(0, nearbyEnemy.health - splashDamage);
  });

  // Create splash effect for visual feedback
  const currentTime = Date.now();
  const splashEffect = createSplashEffect(
    enemy.x + 10, // Center of enemy (enemies are 20x30, so +10 for center)
    enemy.y + 15, // Center of enemy
    splashRadius,
    currentTime
  );
  context.splashEffects.push(splashEffect);
};
