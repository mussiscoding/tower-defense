# Refactor 4: Entity Component Memoization

## Problem

Every 50ms game tick triggers a React re-render, which re-renders ALL entity components:

```typescript
// GameArea.tsx:332-339
{gameState.enemies.map((enemy) => (
  <Enemy key={enemy.id} enemy={enemy} onClick={handleEnemyClick} isPaused={gameState.isPaused} />
))}
```

Even if an enemy's data hasn't changed, it still re-renders because:
1. Parent component re-renders
2. New object references created each tick
3. No memoization on entity components

With 50 enemies, 10 defenders, 20 arrows, and 30 visual effects = 110 component renders every 50ms = 2,200 renders per second.

## Solution

1. Memoize entity components with `React.memo`
2. Use stable callback references with `useCallback`
3. Implement shallow comparison for entity props

## Implementation Plan

### Step 1: Memoize Enemy Component

```typescript
// src/components/Enemy.tsx
import React, { memo } from 'react';
import type { Enemy as EnemyType } from '../types/GameState';

interface EnemyProps {
  enemy: EnemyType;
  onClick: (enemy: EnemyType) => void;
  isPaused: boolean;
}

const EnemyComponent: React.FC<EnemyProps> = ({ enemy, onClick, isPaused }) => {
  // ... existing render logic
};

// Custom comparison - only re-render if these fields change
const areEqual = (prevProps: EnemyProps, nextProps: EnemyProps) => {
  const prev = prevProps.enemy;
  const next = nextProps.enemy;

  return (
    prev.id === next.id &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.health === next.health &&
    prev.maxHealth === next.maxHealth &&
    prev.burnEndTime === next.burnEndTime &&
    prev.slowEndTime === next.slowEndTime &&
    prev.vortexEffect?.endTime === next.vortexEffect?.endTime &&
    prevProps.isPaused === nextProps.isPaused
    // Note: onClick reference should be stable (useCallback in parent)
  );
};

export default memo(EnemyComponent, areEqual);
```

### Step 2: Memoize Defender Component

```typescript
// src/components/Defender.tsx
import React, { memo } from 'react';
import type { Defender as DefenderType } from '../types/GameState';

interface DefenderProps extends DefenderType {}

const DefenderComponent: React.FC<DefenderProps> = (props) => {
  // ... existing render logic
};

const areEqual = (prev: DefenderProps, next: DefenderProps) => {
  return (
    prev.id === next.id &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.type === next.type &&
    prev.currentAnimationFrame === next.currentAnimationFrame
    // Damage/attackSpeed don't affect rendering
  );
};

export default memo(DefenderComponent, areEqual);
```

### Step 3: Memoize Arrow Component

```typescript
// src/components/Arrow.tsx
import React, { memo } from 'react';
import type { ElementType } from '../data/elements';

interface ArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  elementType: ElementType;
}

const ArrowComponent: React.FC<ArrowProps> = (props) => {
  // ... existing render logic
};

// Arrows change every frame (progress), so simple memo is fine
// React.memo's default shallow comparison works here
export default memo(ArrowComponent);
```

### Step 4: Memoize Visual Effect Components

```typescript
// src/components/GoldPopup.tsx
export default memo(GoldPopup);

// src/components/DamageNumber.tsx
export default memo(DamageNumber);

// src/components/FloatingText.tsx
export default memo(FloatingText);

// etc.
```

### Step 5: Stabilize Callback References in GameArea

```typescript
// src/components/GameArea.tsx
const GameArea: React.FC<GameAreaProps> = ({ stateRef, setState, triggerRender }) => {

  // Stable callback reference - won't change between renders
  const handleEnemyClick = useCallback((enemy: EnemyType) => {
    if (stateRef.current.core.isPaused) return;

    const { enemy: damagedEnemy, isDead } = damageEnemy(enemy, stateRef.current.core.clickDamage);

    // Update state...
    triggerRender();
  }, [stateRef, triggerRender]); // stateRef is stable, triggerRender is stable

  // Stable callback for gold popup completion
  const handleGoldPopupComplete = useCallback((id: string) => {
    visualsRef.current.goldPopups = visualsRef.current.goldPopups.filter(p => p.id !== id);
    triggerRender();
  }, [triggerRender]);

  // ... other stable callbacks
};
```

### Step 6: Use Stable Keys

Ensure keys are truly stable:

```typescript
// Good - ID doesn't change
{enemies.map((enemy) => (
  <Enemy key={enemy.id} ... />
))}

// Bad - index as key causes unnecessary re-renders when list changes
{enemies.map((enemy, index) => (
  <Enemy key={index} ... />
))}
```

### Step 7: Batch Visual Effect Renders

Instead of individual components for each visual effect, consider rendering them together:

```typescript
// Before: 30 individual DamageNumber components
{damageNumbers.map(dn => <DamageNumber key={dn.id} {...dn} />)}

// After: Single canvas or SVG that renders all damage numbers
<DamageNumbersLayer damageNumbers={damageNumbers} />
```

This is optional but can significantly reduce component count.

### Step 8: Profile and Verify

Use React DevTools Profiler to verify improvements:

1. Open React DevTools
2. Go to Profiler tab
3. Record a few seconds of gameplay
4. Check "Highlight updates when components render"
5. Verify memoized components don't flash on every tick

## Files to Modify

1. `src/components/Enemy.tsx` - Add memo with custom comparison
2. `src/components/Defender.tsx` - Add memo with custom comparison
3. `src/components/Arrow.tsx` - Add memo
4. `src/components/GoldPopup.tsx` - Add memo
5. `src/components/DamageNumber.tsx` - Add memo
6. `src/components/FloatingText.tsx` - Add memo
7. `src/components/SplashEffect.tsx` - Add memo
8. `src/components/VortexEffect.tsx` - Add memo
9. `src/components/LevelUpAnimation.tsx` - Add memo
10. `src/components/UpgradeFireworks.tsx` - Add memo
11. `src/components/GameArea.tsx` - Add useCallback for handlers

## Expected Performance Improvement

Before:
- 110 components × 20 renders/sec = 2,200 renders/sec

After (estimated):
- Enemies: Only re-render when position/health changes (~10% of ticks)
- Defenders: Only re-render when animation frame changes
- Arrows: Always re-render (progress changes)
- Visual effects: Only re-render their own lifecycle

Estimated: 50-70% reduction in component renders.

## Testing Checklist

- [ ] Enemies still move smoothly
- [ ] Health bars update when enemies take damage
- [ ] Burn/slow/vortex effects display correctly
- [ ] Defenders animate when attacking
- [ ] Arrows fly smoothly
- [ ] Gold popups animate and disappear
- [ ] Damage numbers appear and fade
- [ ] Click-to-damage still works
- [ ] No visual glitches or stuck states
