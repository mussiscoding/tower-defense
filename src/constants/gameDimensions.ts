// Game area dimensions
export const GAME_DIMENSIONS = {
  WIDTH: 800,
  HEIGHT: 600,
  CASTLE_WIDTH: 75,
  DEFENDER_SPAWN_X: 30, // X position where defenders spawn (50% of castle width)
  DEFENDER_SPAWN_Y_MIN: 50, // Minimum Y position for defenders
  DEFENDER_SPAWN_Y_MAX: 550, // Maximum Y position for defenders (600 - 50)
} as const;

// Game mechanics constants
export const GAME_MECHANICS = {
  ARROW_SPEED: 300,
} as const;
