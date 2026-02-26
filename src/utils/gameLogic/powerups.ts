import type { ActivePowerUp, SpawnedPowerUp } from "../../types/GameStateSlices";
import type { ElementType } from "../../data/elements";
import type { GameLoopMeta } from "../../constants/gameTiming";
import { GAME_TIMING } from "../../constants/gameTiming";
import { selectWeightedPowerUp } from "../../data/powerups";

// Multiplier helpers — check activePowerUps for matching buffs
// Optional elementType enables element-specific power-ups (Elemental Surge, Mentorship)
export const getDamageMultiplier = (
  activePowerUps: ActivePowerUp[],
  now: number,
  elementType?: ElementType
): number => {
  let multiplier = 1;
  for (const buff of activePowerUps) {
    if (now >= buff.startTime + buff.duration) continue;
    if (buff.powerUpId === "fury") {
      multiplier *= 2;
    }
    if (buff.powerUpId === "elemental_surge" && elementType && buff.elementType === elementType) {
      multiplier *= 3;
    }
  }
  return multiplier;
};

export const getGoldMultiplier = (
  activePowerUps: ActivePowerUp[],
  now: number
): number => {
  let multiplier = 1;
  for (const buff of activePowerUps) {
    if (buff.powerUpId === "midas_touch" && now < buff.startTime + buff.duration) {
      multiplier *= 2;
    }
  }
  return multiplier;
};

export const getXPMultiplier = (
  activePowerUps: ActivePowerUp[],
  now: number,
  elementType?: ElementType
): number => {
  let multiplier = 1;
  for (const buff of activePowerUps) {
    if (now >= buff.startTime + buff.duration) continue;
    if (buff.powerUpId === "wisdom") {
      multiplier *= 2;
    }
    if (buff.powerUpId === "mentorship" && elementType && buff.elementType === elementType) {
      multiplier *= 3;
    }
  }
  return multiplier;
};

export const getAttackSpeedMultiplier = (
  activePowerUps: ActivePowerUp[],
  now: number
): number => {
  let multiplier = 1;
  for (const buff of activePowerUps) {
    if (buff.powerUpId === "rapid_fire" && now < buff.startTime + buff.duration) {
      multiplier *= 2;
    }
  }
  return multiplier;
};

// Filter out expired active buffs
export const filterExpiredPowerUps = (
  activePowerUps: ActivePowerUp[],
  now: number
): ActivePowerUp[] =>
  activePowerUps.filter((p) => now < p.startTime + p.duration);

// Try to spawn a power-up if the interval has elapsed
export const trySpawnPowerUp = (
  meta: GameLoopMeta,
  now: number
): SpawnedPowerUp | null => {
  if (
    meta.tickCount - meta.lastPowerUpSpawnTick <
    meta.nextPowerUpSpawnInterval
  ) {
    return null;
  }

  // Reset interval for next spawn
  meta.lastPowerUpSpawnTick = meta.tickCount;
  meta.nextPowerUpSpawnInterval =
    GAME_TIMING.POWERUP_MIN_SPAWN_TICKS +
    Math.floor(
      Math.random() *
        (GAME_TIMING.POWERUP_MAX_SPAWN_TICKS -
          GAME_TIMING.POWERUP_MIN_SPAWN_TICKS)
    );

  const powerUp = selectWeightedPowerUp();

  // Random position within battlefield (avoiding castle and edges)
  const x = 200 + Math.random() * 700; // 200–900
  const y = 50 + Math.random() * 500; // 50–550

  return {
    id: `powerup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    powerUpId: powerUp.id,
    x,
    y,
    spawnTime: now,
    despawnTime: now + GAME_TIMING.POWERUP_DESPAWN_MS,
  };
};
