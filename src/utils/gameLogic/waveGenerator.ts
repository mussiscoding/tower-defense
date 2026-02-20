import type { EnemyData } from "../../data/enemies";

interface WaveEnemy {
  enemyId: string;
  count: number;
  isGiant?: boolean;
  customHealth?: number; // For giants with custom HP
}

interface WaveComposition {
  totalDifficultyValue: number;
  waveEnemies: WaveEnemy[];
}

export function generateWave(
  difficulty: number,
  availableEnemies: EnemyData[] // Now takes enemy data objects directly
): WaveComposition {
  const totalDifficultyValue = difficulty * 50;

  // Giants only spawn at difficulty 3+, then 10% chance per wave
  if (difficulty >= 3 && Math.random() < 0.1) {
    return generateGiantWave(totalDifficultyValue);
  }

  return generateValidComposition(totalDifficultyValue, availableEnemies);
}

function generateGiantWave(totalDifficultyValue: number): WaveComposition {
  // Single giant enemy with 1.5x HP budget
  const giantHealth = Math.floor(totalDifficultyValue * 1.5);
  return {
    totalDifficultyValue,
    waveEnemies: [{
      enemyId: "giant",
      count: 1,
      isGiant: true,
      customHealth: giantHealth,
    }],
  };
}

function generateValidComposition(
  totalDifficultyValue: number,
  availableEnemies: EnemyData[]
): WaveComposition {
  const composition = [];
  let remainingDifficultyValue = totalDifficultyValue;

  while (remainingDifficultyValue > 0) {
    // Calculate minimum based on remaining difficulty (at least 1/3 of what's left)
    const minimumEnemyDifficulty = remainingDifficultyValue / 3;

    // Get all enemies that fit within remaining difficulty and meet minimum threshold
    const validEnemies = availableEnemies.filter(
      (enemy) =>
        enemy.difficultyValue <= remainingDifficultyValue &&
        enemy.difficultyValue >= minimumEnemyDifficulty
    );

    if (validEnemies.length === 0) break;

    // Randomly select one and add it to the wave
    const selectedEnemy =
      validEnemies[Math.floor(Math.random() * validEnemies.length)];

    composition.push({ enemyId: selectedEnemy.id, count: 1 });

    remainingDifficultyValue =
      remainingDifficultyValue - selectedEnemy.difficultyValue;
  }

  return { totalDifficultyValue, waveEnemies: composition };
}
