import type { Enemy } from "../../types/GameState";

export const processBurnDamage = (
  enemies: Enemy[],
  currentTime: number
): Enemy[] => {
  return enemies.map((enemy) => {
    if (
      !enemy.burnDamage ||
      !enemy.burnEndTime ||
      currentTime > enemy.burnEndTime
    ) {
      // No burn effect or burn has expired
      if (enemy.burnDamage || enemy.burnEndTime) {
        console.log(`🔥 Burn expired for enemy ${enemy.id} (${enemy.type})`);
      }
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
      const newHealth = Math.max(0, enemy.health - enemy.burnDamage);
      console.log(
        `🔥 Burn tick ${currentTick}: Enemy ${enemy.id} (${enemy.type}) took ${enemy.burnDamage} burn damage. Health: ${enemy.health} → ${newHealth}`
      );
      return {
        ...enemy,
        health: newHealth,
      };
    }

    return enemy;
  });
};
