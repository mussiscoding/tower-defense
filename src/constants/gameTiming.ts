const TICK_MS = 50; // Base game tick

export const GAME_TIMING = {
  TICK_MS,
  TICKS_PER_SECOND: 1000 / TICK_MS,

  // Frequencies (in ticks)
  WAVE_SPAWN_TICKS: 3000 / TICK_MS, // 3 seconds
  CLEANUP_TICKS: 200 / TICK_MS, // 200ms
  SAVE_TICKS: 5000 / TICK_MS, // 5 seconds
  TIME_SURVIVED_TICKS: 1000 / TICK_MS, // 1 second
} as const;

export interface GameLoopMeta {
  tickCount: number;
  lastWaveSpawnTick: number;
  lastCleanupTick: number;
  lastSaveTick: number;
  lastTimeUpdateTick: number;
}

export const createInitialGameLoopMeta = (): GameLoopMeta => ({
  tickCount: 0,
  lastWaveSpawnTick: 0,
  lastCleanupTick: 0,
  lastSaveTick: 0,
  lastTimeUpdateTick: 0,
});
