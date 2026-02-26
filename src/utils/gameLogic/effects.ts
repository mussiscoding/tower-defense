import type { Enemy } from "../../types/GameState";
import type { ActivePowerUp } from "../../types/GameStateSlices";
import { getDamageMultiplier } from "./powerups";

export const processBurnDamage = (
  enemies: Enemy[],
  currentTime: number,
  activePowerUps: ActivePowerUp[] = []
): Enemy[] => {
  return enemies.map((enemy) => {
    if (
      !enemy.burnDamage ||
      !enemy.burnEndTime ||
      currentTime > enemy.burnEndTime
    ) {
      // No burn effect or burn has expired
      return {
        ...enemy,
        burnDamage: undefined,
        burnEndTime: undefined,
      };
    }

    // Apply burn damage every 500ms
    const burnTickInterval = 500;
    const burnStartTime = enemy.burnEndTime - 2000; // 2 second duration
    const timeSinceBurnStart = currentTime - burnStartTime;
    const currentTick = Math.floor(timeSinceBurnStart / burnTickInterval);

    // Only apply damage if we're on a new tick
    if (currentTick > 0 && timeSinceBurnStart % burnTickInterval < 50) {
      const dmgMult = getDamageMultiplier(activePowerUps, currentTime, "fire");
      const newHealth = Math.max(0, enemy.health - Math.floor(enemy.burnDamage * dmgMult));
      return {
        ...enemy,
        health: newHealth,
      };
    }

    return enemy;
  });
};
