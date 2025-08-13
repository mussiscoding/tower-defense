import type { EnemyData } from "../../data/enemies";

interface WaveComposition {
  totalDifficultyValue: number;
  waveEnemies: Array<{ enemyId: string; count: number }>;
}

export function generateWave(
  difficulty: number,
  availableEnemies: EnemyData[] // Now takes enemy data objects directly
): WaveComposition {
  const totalDifficultyValue = difficulty * 50;
  return generateValidComposition(totalDifficultyValue, availableEnemies);
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
