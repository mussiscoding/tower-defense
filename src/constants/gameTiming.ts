const TICK_MS = 50; // Base game tick

export const GAME_TIMING = {
  TICK_MS,
  TICKS_PER_SECOND: 1000 / TICK_MS,

  // Frequencies (in ticks)
  WAVE_SPAWN_TICKS: 4000 / TICK_MS, // 4 seconds
  CLEANUP_TICKS: 200 / TICK_MS, // 200ms
  SAVE_TICKS: 5000 / TICK_MS, // 5 seconds
  TIME_SURVIVED_TICKS: 1000 / TICK_MS, // 1 second
  POWERUP_MIN_SPAWN_TICKS: 1200, // 60 seconds
  POWERUP_MAX_SPAWN_TICKS: 2400, // 120 seconds
  POWERUP_DESPAWN_MS: 9000, // 9 seconds
} as const;

export interface GameLoopMeta {
  tickCount: number;
  lastWaveSpawnTick: number;
  lastCleanupTick: number;
  lastSaveTick: number;
  lastTimeUpdateTick: number;
  lastPowerUpSpawnTick: number;
  nextPowerUpSpawnInterval: number;
}

const randomPowerUpInterval = (): number =>
  GAME_TIMING.POWERUP_MIN_SPAWN_TICKS +
  Math.floor(
    Math.random() *
      (GAME_TIMING.POWERUP_MAX_SPAWN_TICKS - GAME_TIMING.POWERUP_MIN_SPAWN_TICKS)
  );

export const createInitialGameLoopMeta = (): GameLoopMeta => ({
  tickCount: 0,
  lastWaveSpawnTick: 0,
  lastCleanupTick: 0,
  lastSaveTick: 0,
  lastTimeUpdateTick: 0,
  lastPowerUpSpawnTick: 0,
  nextPowerUpSpawnInterval: randomPowerUpInterval(),
});
