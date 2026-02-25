import type { Enemy, SkillContext } from "../../types/GameState";
import { createSplashEffect } from "../../utils/gameLogic/arrow";
import { SKILL_BASE_VALUES } from "../allSkills";
import { calculateSkillValue } from "../../utils/skills";

// Earth Splash onHit handler - applies splash damage to nearby enemies
export const earthSplashOnHit = (
  enemy: Enemy,
  damage: number,
  context: SkillContext
) => {
  // Calculate splash values using centralized skill value calculator
  const splashDamagePercent = calculateSkillValue(
    SKILL_BASE_VALUES.EARTH_SPLASH_DAMAGE,
    "earth_splash_damage_upgrade",
    context.purchases,
    SKILL_BASE_VALUES.EARTH_SPLASH_MAX
  );

  const splashRadius = calculateSkillValue(
    SKILL_BASE_VALUES.EARTH_SPLASH_RADIUS,
    "earth_splash_radius_upgrade",
    context.purchases
  );

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

  // Track splash hit count for achievements
  if (context.achievementEvents && nearbyEnemies.length > 0) {
    if (!context.achievementEvents.splashHitCounts) {
      context.achievementEvents.splashHitCounts = [];
    }
    context.achievementEvents.splashHitCounts.push(nearbyEnemies.length);
  }

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
