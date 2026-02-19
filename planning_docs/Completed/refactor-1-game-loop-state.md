# Refactor 1: Replace React State with Ref-Based Game Loop

## Problem

The game loop runs every 50ms using `setGameState`, but React's state updates are asynchronous and batched. This causes:

1. **Multiple arrows bug** - Defender's `lastAttack` isn't updated immediately, so it fires twice
2. **Over-targeting bug** - Predicted damage isn't visible to subsequent defenders in the same tick
3. **General timing issues** - State reads are stale within the same game tick

Current problematic pattern:
```typescript
// GameArea.tsx:93-233
useEffect(() => {
  const gameLoop = setInterval(() => {
    setGameState((prev) => {
      // All game logic here reads from `prev`
      // But updates aren't visible until next render
    });
  }, 50);
}, []);
```

## Solution

Use `useRef` for game state that needs synchronous access, with `useState` only to trigger re-renders.

## Implementation Plan

### Step 1: Create a Game State Ref Hook

Create `src/hooks/useGameStateRef.ts`:

```typescript
import { useRef, useState, useCallback } from 'react';
import type { GameState } from '../types/GameState';

export const useGameStateRef = (initialState: GameState) => {
  const stateRef = useRef<GameState>(initialState);
  const [, setRenderTrigger] = useState(0);

  const getState = useCallback(() => stateRef.current, []);

  const setState = useCallback((updater: GameState | ((prev: GameState) => GameState)) => {
    if (typeof updater === 'function') {
      stateRef.current = updater(stateRef.current);
    } else {
      stateRef.current = updater;
    }
  }, []);

  const triggerRender = useCallback(() => {
    setRenderTrigger(t => t + 1);
  }, []);

  return { getState, setState, triggerRender, stateRef };
};
```

### Step 2: Update App.tsx

Replace `useState` with the new hook:

```typescript
// Before
const [gameState, setGameState] = useState<GameState>(createInitialState());

// After
const { getState, setState, triggerRender, stateRef } = useGameStateRef(createInitialState());

// For child components that only need to read
<GameArea
  stateRef={stateRef}
  setState={setState}
  triggerRender={triggerRender}
/>
```

### Step 3: Update GameArea.tsx Game Loop

The game loop now mutates synchronously:

```typescript
useEffect(() => {
  if (stateRef.current.isPaused) return;

  const gameLoop = setInterval(() => {
    const state = stateRef.current;

    // All mutations are now synchronous and immediately visible
    const movedEnemies = moveEnemies(state.enemies, Date.now());
    state.enemies = movedEnemies;

    // Defender logic can now see updated predicted damage immediately
    const { defenders, arrows, predictedArrowDamage } = updateDefenders(
      state.defenders,
      state.enemies,
      Date.now(),
      state.predictedArrowDamage,  // This is current, not stale
      // ...
    );

    state.defenders = defenders;
    state.arrows = [...state.arrows, ...arrows];
    state.predictedArrowDamage = predictedArrowDamage;

    // Trigger React re-render once per tick
    triggerRender();
  }, 50);

  return () => clearInterval(gameLoop);
}, [stateRef.current.isPaused, triggerRender]);
```

### Step 4: Update Child Components

Components that modify state need the new pattern:

```typescript
// GameSidebar.tsx
interface GameSidebarProps {
  stateRef: React.MutableRefObject<GameState>;
  setState: (updater: GameState | ((prev: GameState) => GameState)) => void;
  triggerRender: () => void;
}

const handlePurchase = (itemId: string) => {
  const state = stateRef.current;
  // Direct mutation
  state.gold -= cost;
  state.purchases[itemId] = (state.purchases[itemId] || 0) + 1;
  triggerRender();
};
```

### Step 5: Keep useState for Non-Game-Loop State

Some state is fine with React's async updates:
- `isPaused` - User action, not time-critical
- UI-only state in sidebar components

### Step 6: Update Save System

Save system reads from ref:

```typescript
// Auto-save
useEffect(() => {
  const saveInterval = setInterval(() => {
    saveGame(stateRef.current);
    stateRef.current.lastSave = Date.now();
  }, 5000);
  return () => clearInterval(saveInterval);
}, []);
```

## Files to Modify

1. `src/hooks/useGameStateRef.ts` - New file
2. `src/App.tsx` - Replace useState with useGameStateRef
3. `src/components/GameArea.tsx` - Update game loop to use ref
4. `src/components/GameSidebar.tsx` - Update to use ref for purchases
5. `src/components/GameHeader.tsx` - Update to use ref for pause/reset

## Testing

After implementation, verify:
- [ ] Single arrow per attack (not double)
- [ ] Defenders don't over-target enemies predicted to die
- [ ] Air burst fires correct number of shots
- [ ] Game saves/loads correctly
- [ ] Pause/resume works
- [ ] All purchases work

## Risks

- **Render timing**: If we forget to call `triggerRender()`, UI won't update
- **Stale closures**: Event handlers in components might capture old ref if not careful
- **React DevTools**: Won't show state changes as nicely (can add debug logging)

## Rollback Plan

Keep old implementation in a branch. The refactor is self-contained - if issues arise, revert the files.
