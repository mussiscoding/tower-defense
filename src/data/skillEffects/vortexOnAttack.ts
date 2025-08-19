import type {
  Defender,
  Enemy,
  SkillContext,
  VortexData,
} from "../../types/GameState";
import { SKILL_BASE_VALUES } from "../allSkills";
import { calculateSkillValue } from "../../utils/skills";
import { findBestSplashEnemy } from "../../utils/gameLogic/targeting";

// Vortex onAttack handler - creates a wind vortex that pulls enemies together
export const vortexOnAttack = (
  defender: Defender,
  _target: Enemy, // This target is ignored - we find our own
  context: SkillContext
) => {
  // Calculate vortex properties using centralized skill value calculator
  const pullRadius = calculateSkillValue(
    SKILL_BASE_VALUES.VORTEX_PULL_RADIUS,
    "vortex_pull_radius_upgrade", // Future upgrade ID
    context.purchases
  );

  const pullStrength = SKILL_BASE_VALUES.VORTEX_PULL_STRENGTH;
  const duration = SKILL_BASE_VALUES.VORTEX_DURATION;
  const currentTime = Date.now();

  // Find the best target for vortex using the existing splash targeting logic
  // We use a dummy predicted damage map since vortex doesn't deal direct damage
  const dummyPredictedDamage = new Map<string, number>();
  const target = findBestSplashEnemy(
    defender,
    context.enemies,
    dummyPredictedDamage,
    dummyPredictedDamage,
    pullRadius
  );

  if (!target) {
    return; // No enemies on map
  }

  // Create the vortex data structure
  const vortex: VortexData = {
    id: `vortex_${currentTime}_${Math.random().toString(36).substr(2, 9)}`,
    centerX: target.x,
    centerY: target.y,
    radius: pullRadius,
    pullStrength,
    startTime: currentTime,
    duration,
    affectedEnemyIds: new Set(),
  };

  // Find all enemies within the pull radius
  const enemiesInRange = context.enemies.filter((enemy) => {
    const distance = Math.sqrt(
      Math.pow(enemy.x - target.x, 2) + Math.pow(enemy.y - target.y, 2)
    );
    return distance <= pullRadius;
  });

  // Apply vortex effect to all enemies in range
  enemiesInRange.forEach((enemy) => {
    // Calculate pull direction (toward vortex center)
    const deltaX = target.x - enemy.x;
    const deltaY = target.y - enemy.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 0) {
      // Normalize direction and apply pull strength
      const pullDirectionX = (deltaX / distance) * pullStrength;
      const pullDirectionY = (deltaY / distance) * pullStrength;

      // Add vortex effect to enemy
      const updatedEnemy: Enemy = {
        ...enemy,
        vortexEffect: {
          vortexId: vortex.id,
          pullDirectionX,
          pullDirectionY,
          pullStrength,
          endTime: currentTime + duration,
        },
      };

      // Update enemy in context
      const enemyIndex = context.enemies.findIndex((e) => e.id === enemy.id);
      if (enemyIndex !== -1) {
        context.enemies[enemyIndex] = updatedEnemy;
      }

      // Add to affected enemies set
      vortex.affectedEnemyIds.add(enemy.id);
    }
  });

  // Add vortex to context (ensure array exists)
  if (!context.vortexes) {
    context.vortexes = [];
  }
  context.vortexes.push(vortex);
};

// Helper function to update all active vortex effects
export const updateVortexEffects = (
  enemies: Enemy[],
  vortexes: VortexData[],
  currentTime: number
): { updatedEnemies: Enemy[]; activeVortexes: VortexData[] } => {
  // Remove expired vortexes
  const activeVortexes = vortexes.filter(
    (vortex) => currentTime < vortex.startTime + vortex.duration
  );

  // Update enemies with active vortex effects
  const updatedEnemies = enemies.map((enemy) => {
    if (!enemy.vortexEffect) return enemy;

    // Check if vortex is still active
    const vortex = activeVortexes.find(
      (v) => v.id === enemy.vortexEffect!.vortexId
    );
    if (!vortex || currentTime >= enemy.vortexEffect.endTime) {
      // Remove expired vortex effect
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { vortexEffect, ...enemyWithoutVortex } = enemy;
      return enemyWithoutVortex;
    }

    // Vortex is still active, keep the effect
    return enemy;
  });

  return { updatedEnemies, activeVortexes };
};
