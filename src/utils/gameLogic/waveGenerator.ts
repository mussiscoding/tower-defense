import type { EnemyType } from "../../types/GameState";

export interface WaveEnemy {
  health: number;
  colorIndex: number;
  isGiant?: boolean;
  enemyType?: EnemyType;
  speed?: number;
}

export interface WaveComposition {
  totalDifficultyValue: number;
  waveEnemies: WaveEnemy[];
}

export type WaveMode = "fixed-budget" | "fixed-mean";

export const WAVE_BASE_HP = 50;
export const WAVE_GROWTH_RATE = 1.365;
const MEAN_BASE_HP = 10;
const MIN_ENEMIES = 2;
const MAX_ENEMIES = 10;
const SIGMA_RATIO = 0.33;

// Weighted type table: { type, weight, minDifficulty }
const ENEMY_TYPE_TABLE: { type: EnemyType; weight: number; minDifficulty: number }[] = [
  { type: "goblin", weight: 20, minDifficulty: 1 },
  { type: "beast",  weight: 5,  minDifficulty: 2 },
  { type: "giant",  weight: 1,  minDifficulty: 5 },
  { type: "slime",  weight: 2,  minDifficulty: 10 },
];

/**
 * Box-Muller transform: sample from a normal distribution.
 * Returns a value clamped to [min, max], rounded to integer.
 */
function sampleHP(mean: number, stddev: number, min: number, max: number): number {
  const u1 = Math.random() || 0.0001;
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const raw = mean + z * stddev;
  return Math.round(Math.max(min, Math.min(max, raw)));
}

function randomEnemyCount(): number {
  return MIN_ENEMIES + Math.floor(Math.random() * (MAX_ENEMIES - MIN_ENEMIES + 1));
}

function randomColorIndex(): number {
  return Math.floor(Math.random() * 12);
}

function pickEnemyType(difficulty: number): EnemyType {
  const available = ENEMY_TYPE_TABLE.filter((e) => difficulty >= e.minDifficulty);
  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of available) {
    roll -= entry.weight;
    if (roll <= 0) return entry.type;
  }
  return "goblin";
}

function applyTypeSubstitutions(enemies: WaveEnemy[], difficulty: number): WaveEnemy[] {
  return enemies.map((enemy) => {
    const type = pickEnemyType(difficulty);

    switch (type) {
      case "giant":
        return {
          ...enemy,
          health: Math.floor(enemy.health * 1.5),
          speed: 0.7,
          enemyType: "giant",
          isGiant: true,
        };
      case "beast":
        return {
          ...enemy,
          health: Math.max(10, Math.floor(enemy.health * 0.5)),
          speed: 2,
          enemyType: "beast",
        };
      case "slime":
        return {
          ...enemy,
          health: Math.max(10, Math.floor(enemy.health * 0.5)),
          speed: 0.9,
          enemyType: "slime",
        };
      default:
        return { ...enemy, enemyType: "goblin" };
    }
  });
}

export function generateWave(
  difficulty: number,
  mode: WaveMode = "fixed-budget"
): WaveComposition {
  const budget = Math.floor(WAVE_BASE_HP * Math.pow(WAVE_GROWTH_RATE, difficulty - 1));

  let composition: WaveComposition;
  if (mode === "fixed-budget") {
    composition = generateFixedBudgetWave(budget);
  } else {
    composition = generateFixedMeanWave(difficulty, budget);
  }

  composition.waveEnemies = applyTypeSubstitutions(composition.waveEnemies, difficulty);
  return composition;
}

function generateFixedBudgetWave(budget: number): WaveComposition {
  const enemyCount = randomEnemyCount();
  const mean = budget / enemyCount;
  const stddev = mean * SIGMA_RATIO;
  const minHP = Math.max(10, Math.floor(mean * 0.3));
  const maxHP = Math.floor(mean * 2);

  const waveEnemies: WaveEnemy[] = [];
  for (let i = 0; i < enemyCount; i++) {
    waveEnemies.push({
      health: sampleHP(mean, stddev, minHP, maxHP),
      colorIndex: randomColorIndex(),
    });
  }

  return { totalDifficultyValue: budget, waveEnemies };
}

function generateFixedMeanWave(difficulty: number, budget: number): WaveComposition {
  const enemyCount = randomEnemyCount();
  const mean = Math.floor(MEAN_BASE_HP * Math.pow(WAVE_GROWTH_RATE, difficulty - 1));
  const stddev = mean * SIGMA_RATIO;
  const minHP = Math.max(10, Math.floor(mean * 0.3));
  const maxHP = Math.floor(mean * 2);

  const waveEnemies: WaveEnemy[] = [];
  for (let i = 0; i < enemyCount; i++) {
    waveEnemies.push({
      health: sampleHP(mean, stddev, minHP, maxHP),
      colorIndex: randomColorIndex(),
    });
  }

  return { totalDifficultyValue: budget, waveEnemies };
}
