// Game area dimensions
export const GAME_DIMENSIONS = {
  WIDTH: 800,
  HEIGHT: 600,
  CASTLE_WIDTH: 75,
  DEFENDER_SPAWN_X: 30, // X position where defenders spawn (50% of castle width)
  DEFENDER_SPAWN_Y_MIN: 50, // Minimum Y position for defenders
  DEFENDER_SPAWN_Y_MAX: 550, // Maximum Y position for defenders (600 - 50)
} as const;

// Fixed mage positions per element (2 slots + center for single mage)
export const MAGE_POSITIONS = {
  fire:  { slot1: 112, slot2: 163, center: 137 },
  ice:   { slot1: 237, slot2: 288, center: 262 },
  earth: { slot1: 362, slot2: 413, center: 387 },
  air:   { slot1: 487, slot2: 538, center: 512 },
} as const;

// Game mechanics constants
export const GAME_MECHANICS = {
  ARROW_SPEED: 300,
} as const;
