# Refactor 3: Consolidate to Single Game Loop

## Problem

Currently there are **5 separate intervals** that all modify game state:

| Location | Interval | Purpose |
|----------|----------|---------|
| `App.tsx:46` | 1000ms | Increment `timeSurvived` |
| `App.tsx:58` | 5000ms | Auto-save |
| `GameArea.tsx:79` | 3000ms | Wave spawning |
| `GameArea.tsx:93` | 50ms | Main game loop |
| `GameArea.tsx:241` | 100ms | Cleanup expired effects |

Problems:
1. **Race conditions** - Multiple intervals call `setGameState` independently
2. **Non-deterministic order** - Cleanup might run mid-game-tick
3. **Hard to debug** - State changes come from multiple sources
4. **Wasted cycles** - Separate loops for related tasks

## Solution

Single authoritative game loop that handles everything in deterministic order.

## Implementation Plan

### Step 1: Define Tick Frequencies

Not everything needs to run every 50ms:

```typescript
// src/constants/gameTiming.ts
export const GAME_TIMING = {
  TICK_MS: 50,           // Base game tick
  TICKS_PER_SECOND: 20,  // 1000 / 50

  // Frequencies (in ticks)
  WAVE_SPAWN_TICKS: 60,      // 3000ms / 50ms = every 60 ticks
  CLEANUP_TICKS: 4,          // 200ms / 50ms = every 4 ticks
  SAVE_TICKS: 100,           // 5000ms / 50ms = every 100 ticks
  TIME_SURVIVED_TICKS: 20,   // 1000ms / 50ms = every 20 ticks
} as const;
```

### Step 2: Create Tick Counter

Track which tick we're on to know what to run:

```typescript
// In game loop state
interface GameLoopMeta {
  tickCount: number;
  lastWaveSpawnTick: number;
  lastCleanupTick: number;
  lastSaveTick: number;
  lastTimeUpdateTick: number;
}
```

### Step 3: Unified Game Loop

One interval, clear execution order:

```typescript
// GameArea.tsx (or new GameLoop.tsx)
useEffect(() => {
  if (stateRef.current.core.isPaused) return;

  const gameLoop = setInterval(() => {
    const state = stateRef.current;
    const visuals = visualsRef.current;
    const meta = metaRef.current;
    const now = Date.now();

    meta.tickCount++;

    // 1. TIME UPDATE (every 20 ticks = 1 second)
    if (meta.tickCount - meta.lastTimeUpdateTick >= GAME_TIMING.TIME_SURVIVED_TICKS) {
      state.core.timeSurvived++;
      meta.lastTimeUpdateTick = meta.tickCount;
    }

    // 2. WAVE SPAWNING (every 60 ticks = 3 seconds)
    if (meta.tickCount - meta.lastWaveSpawnTick >= GAME_TIMING.WAVE_SPAWN_TICKS) {
      spawnWave(state, gameAreaRef.current);
      meta.lastWaveSpawnTick = meta.tickCount;
    }

    // 3. ENEMY MOVEMENT (every tick)
    state.entities.enemies = moveEnemies(state.entities.enemies, now);

    // 4. BURN DAMAGE (every tick)
    state.entities.enemies = processBurnDamage(state.entities.enemies, now);

    // 5. REMOVE DEAD ENEMIES (every tick)
    state.entities.enemies = removeDeadEnemies(state.entities.enemies);

    // 6. DEFENDER ATTACKS (every tick)
    const defenderResult = updateDefenders(
      state.entities.defenders,
      state.entities.enemies,
      now,
      state.tracking.predictedArrowDamage,
      state.tracking.predictedBurnDamage,
      state.core.purchases,
      state.core.elements
    );
    state.entities.defenders = defenderResult.defenders;
    state.entities.arrows.push(...defenderResult.arrows);
    state.tracking.predictedArrowDamage = defenderResult.predictedArrowDamage;

    // 7. ARROW IMPACTS (every tick)
    const arrowResult = processArrowImpacts(
      state.entities.arrows,
      state.entities.enemies,
      now,
      state.tracking,
      state.core.elements,
      state.core.purchases
    );
    state.entities.arrows = arrowResult.arrows;
    state.entities.enemies = arrowResult.enemies;
    state.core.gold += arrowResult.goldGained;
    visuals.goldPopups.push(...arrowResult.goldPopups);
    visuals.damageNumbers.push(...arrowResult.damageNumbers);

    // 8. CASTLE DAMAGE (every tick)
    const castleResult = processCastleDamage(state.entities.enemies, state.core.castleHealth);
    state.core.castleHealth = castleResult.castleHealth;
    state.entities.enemies = castleResult.enemies;

    // 9. CLEANUP VISUALS (every 4 ticks = 200ms)
    if (meta.tickCount - meta.lastCleanupTick >= GAME_TIMING.CLEANUP_TICKS) {
      cleanupVisuals(visuals, now);
      meta.lastCleanupTick = meta.tickCount;
    }

    // 10. AUTO-SAVE (every 100 ticks = 5 seconds)
    if (meta.tickCount - meta.lastSaveTick >= GAME_TIMING.SAVE_TICKS) {
      saveGame(state);
      state.core.lastSave = now;
      meta.lastSaveTick = meta.tickCount;
    }

    // 11. TRIGGER RENDER
    triggerRender();

  }, GAME_TIMING.TICK_MS);

  return () => clearInterval(gameLoop);
}, [stateRef.current.core.isPaused]);
```

### Step 4: Extract Wave Spawning Logic

Move wave spawning to a pure function:

```typescript
// src/utils/gameLogic/waveSpawner.ts
export const spawnWave = (
  state: GameLoopState,
  gameArea: HTMLDivElement | null
): void => {
  if (!gameArea) return;

  const rect = gameArea.getBoundingClientRect();
  const wave = generateWave(state.core.difficultyLevel, enemies);

  // Instead of setTimeout for each enemy, add them with staggered spawn times
  const enemyIds = wave.waveEnemies.flatMap((waveEnemy) =>
    Array(waveEnemy.count).fill(waveEnemy.enemyId)
  );

  enemyIds.forEach((enemyId) => {
    const spawnDelay = Math.random() * 3000; // Delay in ms
    const spawnX = Math.max(rect.width - 100, 700);
    const spawnY = Math.random() * (rect.height - 100) + 50;

    const newEnemy = createEnemy(spawnX, spawnY, enemyId);
    newEnemy.spawnTime = Date.now() + spawnDelay; // Enemy spawns after delay

    state.entities.pendingEnemies.push(newEnemy);
  });
};

// In game loop, check pending enemies
const spawnReady = state.entities.pendingEnemies.filter(e => now >= e.spawnTime);
state.entities.enemies.push(...spawnReady);
state.entities.pendingEnemies = state.entities.pendingEnemies.filter(e => now < e.spawnTime);
```

### Step 5: Remove Old Intervals

Delete the separate intervals from:
- `App.tsx:43-54` (timer interval)
- `App.tsx:57-66` (save interval)
- `GameArea.tsx:49-86` (wave spawning interval)
- `GameArea.tsx:240-264` (cleanup interval)

### Step 6: Handle Pause State

Pause should stop the single loop:

```typescript
// The isPaused check at the start handles this
// But also need to handle pause/resume smoothly

const handlePause = () => {
  state.core.isPaused = true;
  // Save tick count so we can resume
};

const handleResume = () => {
  state.core.isPaused = false;
  // Loop will restart via useEffect dependency
};
```

## Files to Modify

1. `src/constants/gameTiming.ts` - New file with timing constants
2. `src/App.tsx` - Remove timer and save intervals
3. `src/components/GameArea.tsx` - Consolidate to single loop
4. `src/utils/gameLogic/waveSpawner.ts` - New file for wave logic

## Execution Order (Per Tick)

```
1. Time survived update (conditional)
2. Wave spawning (conditional)
3. Process pending enemy spawns
4. Move enemies
5. Process burn damage
6. Remove dead enemies
7. Defender attacks
8. Arrow impacts
9. Castle damage check
10. Visual cleanup (conditional)
11. Auto-save (conditional)
12. Trigger render
```

## Benefits

- **Deterministic** - Same order every time
- **Debuggable** - Single place for all game logic
- **No race conditions** - One interval, one state modification per tick
- **Flexible** - Easy to add new systems at specific points
- **Testable** - Can unit test the tick function with mock state
