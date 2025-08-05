export interface EnemyData {
  id: string; // "enemy_1", "enemy_2", etc.
  name: string; // "Enemy (10 HP)", "Enemy (20 HP)", etc.
  health: number; // 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480
  difficultyValue: number; // Value used by wave generator (for now = health)
  speed: number; // All same speed
  goldValue: number; // Math.ceil(health / 2)
  colorIndex: number; // 0-11 for shirt color
}

// Generate enemy data programmatically
export const generateEnemyData = (enemyNumber: number): EnemyData => {
  const health = 10 * Math.pow(2, enemyNumber - 1); // 2x progression
  const colorIndex = enemyNumber - 1; // 0-11 for shirt color
  return {
    id: `enemy_${enemyNumber}`,
    name: `Enemy (${health} HP)`,
    health,
    difficultyValue: health, // For now, difficulty value equals health
    speed: 1, // Same speed for all
    goldValue: Math.ceil(health / 2),
    colorIndex,
  };
};

// Generate all enemy types (1-12)
export const enemies: EnemyData[] = Array.from({ length: 12 }, (_, index) =>
  generateEnemyData(index + 1)
);

// Get enemy by ID (e.g., "enemy_1", "enemy_2")
export const getEnemyById = (enemyId: string): EnemyData => {
  return enemies.find((enemy) => enemy.id === enemyId) || enemies[0]; // Fallback to enemy_1
};

// Legacy function for backward compatibility (will be removed)
export const getAvailableEnemies = (): EnemyData[] => {
  // For now, return all enemies - this will be replaced by wave generation
  return enemies;
};

// Legacy fallback (will be removed)
export const fallbackEnemy = enemies[0];
