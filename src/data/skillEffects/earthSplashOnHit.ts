import type { Enemy, SkillContext } from "../../types/GameState";
import { createSplashEffect } from "../../utils/gameLogic/arrow";

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
  const splashDamagePercent = baseSplashPercent + splashDamageUpgrades;

  const baseRadius = 50;
  const radiusUpgrades = context.purchases["earth_splash_radius_upgrade"] || 0;
  const splashRadius = baseRadius + radiusUpgrades * 10; // +10 per upgrade

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
