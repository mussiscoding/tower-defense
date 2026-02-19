# Refactor 2: Split Monolithic Game State

## Problem

The entire game runs on one massive `GameState` object containing 20+ fields:
- Core game data (gold, health, difficulty)
- Entities (enemies, defenders, arrows)
- Visual effects (goldPopups, floatingTexts, damageNumbers, splashEffects)
- Tracking (predictedArrowDamage, predictedBurnDamage)
- UI state (isPaused, lastSave)

Problems:
1. **Every update copies everything** - Changing gold creates copies of all arrays
2. **Visual effects persist with game state** - Ephemeral animations saved to localStorage
3. **Hard to reason about** - What depends on what?
4. **Re-renders cascade** - Any change triggers full re-render

## Solution

Split into focused state slices with clear ownership:

```
GameState (persistent, saved)
├── CoreState (gold, health, difficulty, purchases, elements)
├── EntityState (enemies, defenders, arrows)
└── (removed) Visual effects - moved to separate ref

VisualEffects (ephemeral, not saved)
├── goldPopups
├── floatingTexts
├── damageNumbers
├── splashEffects
├── levelUpAnimations
└── upgradeAnimations
```

## Implementation Plan

### Step 1: Define New Types

Create `src/types/GameStateSlices.ts`:

```typescript
import type { ElementType } from "../data/elements";
import type { Enemy, Defender, Arrow, ElementData, VortexData } from "./GameState";

// Core game state - persistent, saved
export interface CoreState {
  gold: number;
  castleHealth: number;
  timeSurvived: number;
  clickDamage: number;
  difficultyLevel: number;
  isPaused: boolean;
  lastSave: number;
  purchases: Record<string, number>;
  elements: Record<ElementType, ElementData>;
}

// Entity state - game objects
export interface EntityState {
  enemies: Enemy[];
  defenders: Defender[];
  arrows: Arrow[];
  vortexes: VortexData[];
}

// Tracking state - used for targeting logic
export interface TrackingState {
  predictedArrowDamage: Map<string, number>;
  predictedBurnDamage: Map<string, number>;
}

// Visual effects - ephemeral, NOT saved
export interface VisualEffects {
  goldPopups: GoldPopup[];
  floatingTexts: FloatingText[];
  damageNumbers: DamageNumber[];
  splashEffects: SplashEffect[];
  levelUpAnimations: LevelUpAnimation[];
  upgradeAnimations: UpgradeAnimation[];
}

// Combined for game loop (what gets passed around)
export interface GameLoopState {
  core: CoreState;
  entities: EntityState;
  tracking: TrackingState;
}

// Full state including visuals (for rendering)
export interface FullGameState extends GameLoopState {
  visuals: VisualEffects;
}
```

### Step 2: Update Save System

Only save what matters - exclude visual effects:

```typescript
// saveSystem.ts
export const saveGame = (state: GameLoopState): void => {
  const saveData = {
    core: state.core,
    entities: {
      enemies: state.entities.enemies,
      defenders: state.entities.defenders,
      // Don't save arrows - they're transient
      // Don't save vortexes - they're transient
    },
    tracking: {
      predictedArrowDamage: Array.from(state.tracking.predictedArrowDamage.entries()),
      predictedBurnDamage: Array.from(state.tracking.predictedBurnDamage.entries()),
    },
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
};
```

### Step 3: Separate Visual Effects into Own Ref

Visual effects don't need to trigger re-renders of game logic:

```typescript
// App.tsx or GameArea.tsx
const visualsRef = useRef<VisualEffects>({
  goldPopups: [],
  floatingTexts: [],
  damageNumbers: [],
  splashEffects: [],
  levelUpAnimations: [],
  upgradeAnimations: [],
});
```

### Step 4: Update Game Loop

Game loop works with slices, adds to visual effects separately:

```typescript
const gameLoop = setInterval(() => {
  const state = stateRef.current;
  const visuals = visualsRef.current;

  // Entity updates (doesn't touch visuals)
  const { enemies, arrows, goldGained, newGoldPopups } = processArrowImpacts(
    state.entities.arrows,
    state.entities.enemies,
    // ...
  );

  // Update game state
  state.entities.enemies = enemies;
  state.entities.arrows = arrows;
  state.core.gold += goldGained;

  // Add visual effects separately
  visuals.goldPopups.push(...newGoldPopups);

  triggerRender();
}, 50);
```

### Step 5: Visual Effects Cleanup

Separate cleanup for visuals (can run less frequently):

```typescript
useEffect(() => {
  const cleanup = setInterval(() => {
    const now = Date.now();
    const visuals = visualsRef.current;

    visuals.goldPopups = visuals.goldPopups.filter(p => now - p.startTime < 1000);
    visuals.floatingTexts = visuals.floatingTexts.filter(t => now - t.startTime < t.duration);
    // etc.
  }, 200); // Less frequent than game loop

  return () => clearInterval(cleanup);
}, []);
```

### Step 6: Update Component Props

Components receive only what they need:

```typescript
// Before
<GameSidebar gameState={gameState} setGameState={setGameState} />

// After
<GameSidebar
  core={stateRef.current.core}
  entities={stateRef.current.entities}
  onPurchase={handlePurchase}
/>
```

### Step 7: Create Initial State Factories

```typescript
// src/utils/initialState.ts
export const createInitialCoreState = (): CoreState => ({
  gold: 0,
  castleHealth: 100,
  timeSurvived: 0,
  clickDamage: 1,
  difficultyLevel: 1,
  isPaused: false,
  lastSave: Date.now(),
  purchases: {},
  elements: createInitialElements(),
});

export const createInitialEntityState = (): EntityState => ({
  enemies: [],
  defenders: [],
  arrows: [],
  vortexes: [],
});

export const createInitialTrackingState = (): TrackingState => ({
  predictedArrowDamage: new Map(),
  predictedBurnDamage: new Map(),
});

export const createInitialVisuals = (): VisualEffects => ({
  goldPopups: [],
  floatingTexts: [],
  damageNumbers: [],
  splashEffects: [],
  levelUpAnimations: [],
  upgradeAnimations: [],
});
```

## Files to Modify

1. `src/types/GameStateSlices.ts` - New file with slice types
2. `src/types/GameState.ts` - Keep entity types, remove combined GameState
3. `src/utils/initialState.ts` - New file with factory functions
4. `src/utils/saveSystem.ts` - Update to save only game loop state
5. `src/App.tsx` - Use sliced state
6. `src/components/GameArea.tsx` - Separate visuals from game state
7. `src/components/GameSidebar.tsx` - Receive only needed slices
8. `src/components/GameHeader.tsx` - Receive only core state

## Migration Strategy

1. Create new types alongside old ones
2. Update App.tsx to use new structure
3. Update save system
4. Update components one by one
5. Remove old GameState type when done

## Benefits After Refactor

- Clearer data ownership
- Smaller save files (no visual effects)
- Better performance (targeted updates)
- Easier to add new features to specific slices
