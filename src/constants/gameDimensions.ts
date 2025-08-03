// Game area dimensions
export const GAME_DIMENSIONS = {
  WIDTH: 800,
  HEIGHT: 600,
  CASTLE_WIDTH: 50,
  DEFENDER_SPAWN_X: 50, // X position where defenders spawn
  DEFENDER_SPAWN_Y_MIN: 50, // Minimum Y position for defenders
  DEFENDER_SPAWN_Y_MAX: 550, // Maximum Y position for defenders (600 - 50)
} as const;

// Game mechanics constants
export const GAME_MECHANICS = {
  ARROW_SPEED: 300, // pixels per second
  ENEMY_SPEED: 50, // pixels per second (base speed)
  CASTLE_X: 50, // Castle position
} as const;
