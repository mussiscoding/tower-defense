import type { EnemyType } from "../assets/enemy-sprites";

export interface EnemyData {
  id: string;
  name: string;
  type: EnemyType;
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
    health: 10,
    speed: 1,
    goldValue: 5,
    minDifficulty: 1,
    maxDifficulty: 1, // Stop spawning at difficulty 3+
  },
  {
    id: "orc",
    name: "Orc",
    type: "orc",
    health: 50,
    speed: 0.7,
    goldValue: 12,
    minDifficulty: 2,
    maxDifficulty: 2, // Available at difficulty 2-3
  },
  {
    id: "skeleton",
    name: "Skeleton",
    type: "skeleton",
    health: 150,
    speed: 0.6,
    goldValue: 18,
    minDifficulty: 3,
    maxDifficulty: 3, // Available only at difficulty 3
  },
  {
    id: "demon",
    name: "Demon",
    type: "demon",
    health: 400,
    speed: 0.3,
    goldValue: 35,
    minDifficulty: 4,
    maxDifficulty: 4, // Available only at difficulty 4+
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
  health: 10,
  speed: 1,
  goldValue: 5,
  minDifficulty: 1,
  maxDifficulty: 3,
};
