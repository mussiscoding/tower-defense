export interface EnemyData {
  id: string;
  name: string;
  type: "goblin" | "orc" | "troll";
  health: number;
  speed: number;
  goldValue: number;
  minDifficulty: number;
  maxDifficulty: number;
}

export const enemies: EnemyData[] = [
  {
    id: "goblin",
    name: "Goblin",
    type: "goblin",
    health: 1,
    speed: 1,
    goldValue: 5,
    minDifficulty: 1,
    maxDifficulty: 2, // Stop spawning at difficulty 3+
  },
  {
    id: "orc",
    name: "Orc",
    type: "orc",
    health: 5,
    speed: 0.7,
    goldValue: 12,
    minDifficulty: 2,
    maxDifficulty: 3, // Available at difficulty 2-3
  },
  {
    id: "troll",
    name: "Troll",
    type: "troll",
    health: 25,
    speed: 0.4,
    goldValue: 25,
    minDifficulty: 3,
    maxDifficulty: 3, // Available only at difficulty 3
  },
];

export const getAvailableEnemies = (difficultyLevel: number): EnemyData[] => {
  const available = enemies.filter(
    (enemy) =>
      difficultyLevel >= enemy.minDifficulty &&
      difficultyLevel <= enemy.maxDifficulty
  );

  return available;
};

// Fallback to goblin if no enemies available
export const fallbackEnemy = {
  id: "goblin",
  name: "Goblin",
  type: "goblin" as const,
  health: 1,
  speed: 1,
  goldValue: 5,
  minDifficulty: 1,
  maxDifficulty: 3,
};
