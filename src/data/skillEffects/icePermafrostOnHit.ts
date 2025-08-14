import type { Enemy } from "../../types/GameState";

// Ice Permafrost onHit handler - freezes enemy (speed = 0) for 1 second on first ice hit
export const icePermafrostOnHit = (enemy: Enemy) => {
  // Only apply permafrost to enemies that were NOT slowed before this hit
  // If enemy has slow that expires in exactly 3000ms from now, it was just applied by the ice slow skill
  const currentTime = Date.now();
  const wasJustSlowed = !!(
    (
      enemy.slowEffect &&
      enemy.slowEndTime &&
      Math.abs(enemy.slowEndTime - (currentTime + 3000)) < 50
    ) // Within 50ms of exactly 3s from now
  );

  // If enemy wasn't slowed before OR was just slowed by this same attack, apply permafrost
  const wasSlowedBefore = !!(
    enemy.slowEffect &&
    enemy.slowEndTime &&
    !wasJustSlowed
  );

  if (wasSlowedBefore) {
    return; // Enemy was already slowed before this hit, don't apply permafrost
  }

  const freezeDuration = 1000; // 1 second in milliseconds

  // Apply complete freeze (100% slow = speed becomes 0)
  enemy.slowEffect = 100;
  enemy.slowEndTime = currentTime + freezeDuration;
};
