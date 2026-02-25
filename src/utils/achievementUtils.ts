import type { GameState } from "../types/GameStateSlices";
import { achievementMap, stateAchievements } from "../data/achievements";

/**
 * Try to unlock a specific achievement (event-based).
 * Returns true if newly unlocked.
 */
export const tryUnlockAchievement = (id: string, state: GameState): boolean => {
  if (state.core.achievements[id]) return false; // already unlocked
  const def = achievementMap[id];
  if (!def) return false;
  state.core.achievements[id] = Date.now();
  state.core.gold += def.reward;
  state.core.totalGoldEarned += def.reward;
  state.visuals.achievementQueue.push(id);
  return true;
};

/**
 * Check all state-based achievements (called from game loop).
 */
export const checkStateAchievements = (state: GameState): void => {
  stateAchievements.forEach((def) => {
    if (state.core.achievements[def.id]) return; // already unlocked
    if (def.check(state)) {
      tryUnlockAchievement(def.id, state);
    }
  });
};
