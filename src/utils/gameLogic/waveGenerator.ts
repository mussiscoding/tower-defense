export interface WaveEnemy {
  health: number;
  colorIndex: number;
  isGiant?: boolean;
}

export interface WaveComposition {
  totalDifficultyValue: number;
  waveEnemies: WaveEnemy[];
}

export type WaveMode = "fixed-budget" | "fixed-mean";

const WAVE_BASE_HP = 50;
const WAVE_GROWTH_RATE = 1.365;
const MEAN_BASE_HP = 10;
const MIN_ENEMIES = 2;
const MAX_ENEMIES = 10;
const SIGMA_RATIO = 0.33;

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

export function generateWave(
  difficulty: number,
  mode: WaveMode = "fixed-budget"
): WaveComposition {
  const budget = Math.floor(WAVE_BASE_HP * Math.pow(WAVE_GROWTH_RATE, difficulty - 1));

  // Giant wave: 10% chance at difficulty 3+
  if (difficulty >= 3 && Math.random() < 0.1) {
    return generateGiantWave(budget);
  }

  if (mode === "fixed-budget") {
    return generateFixedBudgetWave(budget);
  } else {
    return generateFixedMeanWave(difficulty, budget);
  }
}

function generateGiantWave(budget: number): WaveComposition {
  const giantHealth = Math.floor(budget * 1.5);
  return {
    totalDifficultyValue: budget,
    waveEnemies: [{
      health: giantHealth,
      colorIndex: randomColorIndex(),
      isGiant: true,
    }],
  };
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
