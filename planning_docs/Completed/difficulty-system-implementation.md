# Difficulty System Implementation Plan

## Overview

Replace the current two-slider difficulty system (spawn rate + enemy difficulty) with a single infinite-scaling difficulty system (1-10000) that generates waves of enemies with total HP equal to difficulty × 10.

## Core Design

### Difficulty Calculation

- **Formula**: `totalWaveHp = difficultyLevel × 10`
- **Range**: 1-10000 (effectively infinite scaling)
- **Example**: Difficulty 50 = 500 HP wave, Difficulty 1000 = 10000 HP wave

### Enemy System

- **Naming**: `enemy_x` where x = 1-12 (enemy_1 = 10hp, enemy_2 = 20hp, etc.)
- **Sprite**: All enemies use goblin sprite with color variations
- **Color System**: 12 different shirt colors (one per enemy type)
- **Health Progression**: 2x scaling (10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480)
- **Difficulty Value**: The value used by the wave generator to match total difficulty (for now = hp, but allows for future enemies with different difficulty weights)
- **Speed**: All enemies have same speed (no HP scaling)
- **Gold**: Scales with HP (goldValue = Math.ceil(hp / 2))

## UI Changes

### GameSidebar.tsx

Replace current difficulty controls with:

```typescript
<div className="control-group">
  <label htmlFor="difficulty">Difficulty Level</label>
  <div className="difficulty-input">
    <button onClick={() => setDifficulty(Math.max(1, difficulty - 10))}>
      -10
    </button>
    <button onClick={() => setDifficulty(Math.max(1, difficulty - 1))}>
      -1
    </button>
    <input
      type="number"
      min="1"
      max="10000"
      value={difficulty}
      onChange={(e) => setDifficulty(parseInt(e.target.value) || 1)}
    />
    <button onClick={() => setDifficulty(Math.min(10000, difficulty + 1))}>
      +1
    </button>
    <button onClick={() => setDifficulty(Math.min(10000, difficulty + 10))}>
      +10
    </button>
  </div>
</div>
```

## Enemy Data Structure

### Update src/data/enemies.ts

```typescript
export interface EnemyData {
  id: string; // "enemy_1", "enemy_2", etc.
  name: string; // "Enemy (10 HP)", "Enemy (20 HP)", etc.
  type: EnemyType; // All use "goblin" for now
  health: number; // 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480
  difficultyValue: number; // Value used by wave generator (for now = health)
  speed: number; // All same speed
  goldValue: number; // Math.ceil(health / 2)
  colorIndex: number; // 0-11 for shirt color
}

// Generate enemy data programmatically
export const generateEnemyData = (enemyType: number): EnemyData => {
  const health = 10 * Math.pow(2, enemyType - 1); // 2x progression
  const colorIndex = enemyType - 1; // 0-11 for shirt color
  return {
    id: `enemy_${enemyType}`,
    name: `Enemy (${health} HP)`,
    type: "goblin",
    health,
    difficultyValue: health, // For now, difficulty value equals health
    speed: 1, // Same speed for all
    goldValue: Math.ceil(health / 2),
    colorIndex,
  };
};
```

## Wave Generation System

### Create src/utils/gameLogic/waveGenerator.ts

```typescript
interface WaveComposition {
  totalDifficultyValue: number;
  enemies: Array<{ enemyType: number; count: number }>;
}

export function generateWave(difficulty: number): WaveComposition {
  const totalDifficultyValue = difficulty * 10;
  return generateValidComposition(totalDifficultyValue);
}

function generateValidComposition(
  totalDifficultyValue: number
): WaveComposition {
  // Algorithm to create valid enemy combinations
  // Examples:
  // Difficulty 50 (500 value): [enemy_3, enemy_3, enemy_3, enemy_3, enemy_3] or [enemy_6] or [enemy_5, enemy_4]
  // Difficulty 100 (1000 value): [enemy_7] or [enemy_6, enemy_6] or [enemy_5, enemy_5, enemy_5, enemy_5, enemy_5]
}
```

## Implementation Steps

### Phase 1: Wave Generation

1. Create `src/utils/gameLogic/waveGenerator.ts`
2. Implement wave composition algorithm

### Phase 2: Enemy System Setup

1. Update `src/data/enemies.ts` with new enemy generation system
2. Create color wheel utility for shirt colors
3. Update enemy sprite rendering to use color variations
4. Remove old enemy type system (orc, skeleton, demon)

### Phase 3: UI Updates

1. Replace difficulty controls in `GameSidebar.tsx`
2. Add +1, +10, -1, -10 buttons
3. Update difficulty input styling
4. Remove spawn rate controls

### Phase 4: Game Logic Updates

1. Update `src/utils/gameLogic/enemy.ts` for new enemy creation
2. Modify `src/components/GameArea.tsx` for wave-based spawning
3. Update `src/types/GameState.ts` to remove spawn rate

### Phase 5: Testing & Balance

1. Test wave generation with different difficulties
2. Balance enemy HP progression
3. Test UI responsiveness
4. Verify infinite scaling works

## Wave Generation Algorithm

### Option A: Pure Greedy (Always Largest Enemy)

```typescript
function generateValidComposition(
  totalDifficultyValue: number
): WaveComposition {
  const availableDifficultyValues = [
    10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480,
  ]; // 2x progression
  const composition = [];
  let remainingDifficultyValue = totalDifficultyValue;

  while (remainingDifficultyValue > 0) {
    // Find largest enemy that fits
    const validEnemies = availableDifficultyValues.filter(
      (difficultyValue) => difficultyValue <= remainingDifficultyValue
    );
    if (validEnemies.length === 0) break;

    // Always select the largest enemy that fits
    const selectedDifficultyValue = Math.max(...validEnemies);

    // Convert difficulty value to enemy type (1-12)
    const enemyType = Math.log2(selectedDifficultyValue / 10) + 1;
    composition.push({ enemyType: Math.round(enemyType), count: 1 });
    remainingDifficultyValue -= selectedDifficultyValue;
  }

  return { totalDifficultyValue, enemies: composition };
}
```

### Option B: Dynamic Programming (All Possible Combinations)

```typescript
function generateValidComposition(
  totalDifficultyValue: number
): WaveComposition {
  const availableDifficultyValues = [
    10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480,
  ];

  // Generate all possible combinations that sum to totalDifficultyValue
  const allCombinations = findAllCombinations(
    availableDifficultyValues,
    totalDifficultyValue
  );

  if (allCombinations.length === 0) {
    // Fallback: use largest enemy that fits
    const largestEnemy = availableDifficultyValues
      .filter((val) => val <= totalDifficultyValue)
      .sort((a, b) => b - a)[0];
    const enemyType = Math.log2(largestEnemy / 10) + 1;
    return {
      totalDifficultyValue,
      enemies: [{ enemyType: Math.round(enemyType), count: 1 }],
    };
  }

  // Randomly select one combination
  const selectedCombination =
    allCombinations[Math.floor(Math.random() * allCombinations.length)];

  // Convert to enemy types
  const enemies = selectedCombination.map((difficultyValue) => {
    const enemyType = Math.log2(difficultyValue / 10) + 1;
    return { enemyType: Math.round(enemyType), count: 1 };
  });

  return { totalDifficultyValue, enemies };
}

function findAllCombinations(values: number[], target: number): number[][] {
  const dp: number[][][] = Array(target + 1)
    .fill(null)
    .map(() => []);
  dp[0] = [[]];

  for (const value of values) {
    for (let i = value; i <= target; i++) {
      for (const combination of dp[i - value]) {
        dp[i].push([...combination, value]);
      }
    }
  }

  return dp[target];
}
```

### Option C: Template-Based System

```typescript
interface WaveTemplate {
  name: string;
  description: string;
  patterns: Array<{ enemyType: number; weight: number }>;
}

const WAVE_TEMPLATES: WaveTemplate[] = [
  {
    name: "Swarm",
    description: "Many small enemies",
    patterns: [
      { enemyType: 1, weight: 0.4 },
      { enemyType: 2, weight: 0.3 },
      { enemyType: 3, weight: 0.2 },
      { enemyType: 4, weight: 0.1 },
    ],
  },
  {
    name: "Boss",
    description: "One large enemy",
    patterns: [
      { enemyType: 8, weight: 0.6 },
      { enemyType: 9, weight: 0.3 },
      { enemyType: 10, weight: 0.1 },
    ],
  },
  {
    name: "Mixed",
    description: "Variety of enemy sizes",
    patterns: [
      { enemyType: 3, weight: 0.3 },
      { enemyType: 5, weight: 0.3 },
      { enemyType: 7, weight: 0.2 },
      { enemyType: 9, weight: 0.2 },
    ],
  },
];

function generateValidComposition(
  totalDifficultyValue: number
): WaveComposition {
  // Randomly select a template
  const template =
    WAVE_TEMPLATES[Math.floor(Math.random() * WAVE_TEMPLATES.length)];

  const composition = [];
  let remainingDifficultyValue = totalDifficultyValue;

  while (remainingDifficultyValue > 0) {
    // Select enemy type based on template weights
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedEnemyType = 1;

    for (const pattern of template.patterns) {
      cumulativeWeight += pattern.weight;
      if (random <= cumulativeWeight) {
        selectedEnemyType = pattern.enemyType;
        break;
      }
    }

    // Get difficulty value for this enemy type
    const difficultyValue = 10 * Math.pow(2, selectedEnemyType - 1);

    if (difficultyValue <= remainingDifficultyValue) {
      composition.push({ enemyType: selectedEnemyType, count: 1 });
      remainingDifficultyValue -= difficultyValue;
    } else {
      // Try smaller enemies if the selected one doesn't fit
      const smallerEnemyType = Math.max(1, selectedEnemyType - 1);
      const smallerDifficultyValue = 10 * Math.pow(2, smallerEnemyType - 1);

      if (smallerDifficultyValue <= remainingDifficultyValue) {
        composition.push({ enemyType: smallerEnemyType, count: 1 });
        remainingDifficultyValue -= smallerDifficultyValue;
      } else {
        break; // Can't fit any more enemies
      }
    }
  }

  return { totalDifficultyValue, enemies: composition };
}
```

### Option D: Filling out the total difficulty

Select a random first enemy with difficulty less than the total, remove that enemies difficulty from the total, find another enemy with difficutly less than the new total. Continue until all the difficulty "budget" is used.

```typescript
function generateValidComposition(
  totalDifficultyValue: number
): WaveComposition {
  const availableDifficultyValues = [
    10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480,
  ];

  const composition = [];
  let remainingDifficultyValue = totalDifficultyValue;

  while (remainingDifficultyValue > 0) {
    // Get all enemies with difficulty less than remaining
    const validEnemies = availableDifficultyValues.filter(
      (difficultyValue) => difficultyValue <= remainingDifficultyValue
    );

    if (validEnemies.length === 0) break;

    // Randomly select one and add it to the wave
    const selectedDifficultyValue =
      validEnemies[Math.floor(Math.random() * validEnemies.length)];

    const enemyType = Math.log2(selectedDifficultyValue / 10) + 1;
    composition.push({ enemyType: Math.round(enemyType), count: 1 });

    remainingDifficultyValue =
      remainingDifficultyValue - selectedDifficultyValue;
  }

  return { totalDifficultyValue, enemies: composition };
}
```

## Future Enhancements

- Staggered wave spawning for better visuals
- Wave composition display in UI
- Wave templates (swarm, boss, mixed)
- Difficulty presets
- Wave preview system

## Technical Notes

- All enemies use goblin sprite with color variations
- Speed remains constant across all enemies
- Gold scales linearly with HP
- Difficulty can scale infinitely (1-10000+)
- Wave spawning is instant (no staggering initially)
