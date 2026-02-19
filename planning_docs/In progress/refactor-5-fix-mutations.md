# Refactor 5: Fix Direct State Mutations

## Problem

The code creates shallow copies but then mutates nested objects:

```typescript
// arrow.ts:108-113
const updatedElements = {
  fire: { ...elements.fire },  // Shallow copy
  ice: { ...elements.ice },
  earth: { ...elements.earth },
  air: { ...elements.air },
};

// arrow.ts:157-158
element.xp += damage;  // Direct mutation of the copied object!
element.totalDamage += damage;
```

While this happens to work because we copied the parent object, it's:
1. **Inconsistent** - Some places mutate, others don't
2. **Bug-prone** - Easy to forget the copy and mutate original
3. **Hard to track** - Where did state change? Mutations are invisible
4. **React-unfriendly** - React's shallow comparison might miss nested changes

## Solution

After Refactor 1 (ref-based state), direct mutations become intentional and safe. But we should still be consistent and explicit about it.

Two approaches depending on context:

### Approach A: Explicit Mutations (Post-Refactor 1)

With ref-based state, mutations are expected. Make them obvious:

```typescript
// Clear naming indicates mutation
function updateElementXP(elements: Record<ElementType, ElementData>, type: ElementType, xp: number) {
  elements[type].xp += xp;
  elements[type].totalDamage += xp;

  // Check for level up
  const newLevel = getLevelFromXP(elements[type].xp);
  if (newLevel > elements[type].level) {
    elements[type].level = newLevel;
    elements[type].baseStats = calculateElementStats(type, newLevel);
  }
}
```

### Approach B: Immutable Updates (If Keeping React State)

If we keep React state patterns, use proper immutable updates:

```typescript
// Proper immutable nested update
const updatedElements = {
  ...elements,
  [arrow.elementType]: {
    ...elements[arrow.elementType],
    xp: elements[arrow.elementType].xp + damage,
    totalDamage: elements[arrow.elementType].totalDamage + damage,
  },
};
```

## Implementation Plan

Since we're doing Refactor 1 first (ref-based state), we'll go with Approach A.

### Step 1: Audit All Mutations

Find everywhere we mutate state:

| File | Line | Mutation | Status |
|------|------|----------|--------|
| `arrow.ts` | 157-158 | `element.xp += damage` | Fix |
| `arrow.ts` | 165-167 | `element.level = newLevel` | Fix |
| `enemy.ts` | Various | `enemy.health -= damage` | Keep (intentional) |
| `defender.ts` | 253-256 | `defender.lastAttack = currentTime` | Keep (intentional) |
| `skillEffects/*` | Various | Direct enemy mutations | Keep (intentional) |

### Step 2: Create Mutation Helper Functions

Centralize mutations with clear intent:

```typescript
// src/utils/gameLogic/mutations.ts

import type { Enemy, Defender, ElementData } from '../../types/GameState';
import type { ElementType } from '../../data/elements';
import { getLevelFromXP, calculateElementStats } from '../../data/elements';

/**
 * Grant XP to an element and handle level-ups
 * MUTATES: elements[type]
 */
export function grantElementXP(
  elements: Record<ElementType, ElementData>,
  type: ElementType,
  xp: number
): { leveledUp: boolean; newLevel: number } {
  const element = elements[type];
  const oldLevel = element.level;

  element.xp += xp;
  element.totalDamage += xp;

  const newLevel = getLevelFromXP(element.xp);
  if (newLevel > oldLevel) {
    element.level = newLevel;
    element.baseStats = calculateElementStats(type, newLevel);
    return { leveledUp: true, newLevel };
  }

  return { leveledUp: false, newLevel: oldLevel };
}

/**
 * Apply damage to an enemy
 * MUTATES: enemy.health
 */
export function applyDamage(enemy: Enemy, damage: number): { isDead: boolean } {
  enemy.health = Math.max(0, enemy.health - damage);
  return { isDead: enemy.health <= 0 };
}

/**
 * Apply burn effect to an enemy
 * MUTATES: enemy.burnDamage, enemy.burnEndTime
 */
export function applyBurn(
  enemy: Enemy,
  burnDamagePercent: number,
  duration: number,
  currentTime: number
): void {
  const burnDamage = enemy.maxHealth * (burnDamagePercent / 100);
  enemy.burnDamage = burnDamage;
  enemy.burnEndTime = currentTime + duration;
}

/**
 * Apply slow effect to an enemy
 * MUTATES: enemy.slowEffect, enemy.slowEndTime
 */
export function applySlow(
  enemy: Enemy,
  slowPercent: number,
  duration: number,
  currentTime: number
): void {
  enemy.slowEffect = slowPercent / 100;
  enemy.slowEndTime = currentTime + duration;
}

/**
 * Record defender attack time
 * MUTATES: defender.lastAttack
 */
export function recordAttack(defender: Defender, currentTime: number): void {
  defender.lastAttack = currentTime;
}

/**
 * Update defender animation frame
 * MUTATES: defender.currentAnimationFrame
 */
export function updateAnimationFrame(defender: Defender, frame: number): void {
  defender.currentAnimationFrame = frame;
}
```

### Step 3: Update arrow.ts to Use Helpers

```typescript
// Before
element.xp += damage;
element.totalDamage += damage;
const newLevel = getLevelFromXP(element.xp);
if (newLevel > element.level) {
  element.level = newLevel;
  element.baseStats = calculateElementStats(arrow.elementType, newLevel);
}

// After
import { grantElementXP } from './mutations';

const { leveledUp, newLevel } = grantElementXP(
  updatedElements,
  arrow.elementType,
  damage
);

if (leveledUp) {
  // Trigger level-up animation
}
```

### Step 4: Update Skill Effects to Use Helpers

```typescript
// src/data/skillEffects/fireBurnOnHit.ts
import { applyBurn } from '../../utils/gameLogic/mutations';

export const fireBurnOnHit = (enemy: Enemy, damage: number, context: SkillContext) => {
  const burnDamagePercent = calculateSkillValue(
    SKILL_BASE_VALUES.FIRE_BURN_DAMAGE,
    'fire_burn_damage_upgrade',
    context.purchases
  );

  applyBurn(enemy, burnDamagePercent, BURN_DURATION, Date.now());
};
```

### Step 5: Add JSDoc Comments for Mutation Functions

Make it clear in IDE which functions mutate:

```typescript
/**
 * Apply damage to an enemy.
 *
 * @mutates enemy.health
 * @param enemy - The enemy to damage (will be mutated)
 * @param damage - Amount of damage to apply
 * @returns Whether the enemy died
 */
export function applyDamage(enemy: Enemy, damage: number): { isDead: boolean } {
```

### Step 6: Consider ESLint Rule (Optional)

Add a custom ESLint rule or comment convention:

```typescript
// @mutation - Indicates this function mutates its arguments
export function applyDamage(enemy: Enemy, damage: number) {
```

## Files to Modify

1. `src/utils/gameLogic/mutations.ts` - New file with mutation helpers
2. `src/utils/gameLogic/arrow.ts` - Use `grantElementXP` helper
3. `src/utils/gameLogic/enemy.ts` - Use `applyDamage` helper
4. `src/utils/gameLogic/effects.ts` - Use mutation helpers
5. `src/data/skillEffects/fireBurnOnHit.ts` - Use `applyBurn` helper
6. `src/data/skillEffects/iceSlowOnHit.ts` - Use `applySlow` helper
7. `src/data/skillEffects/icePermafrostOnHit.ts` - Use helpers
8. Other skill effect files as needed

## Benefits

1. **Explicit intent** - Clear which functions mutate state
2. **Centralized logic** - Level-up calculation in one place
3. **Easier debugging** - Can add logging to mutation functions
4. **Type safety** - Helpers ensure correct types
5. **Testable** - Can unit test mutation functions in isolation

## Testing Checklist

- [ ] XP grants correctly
- [ ] Level-ups trigger at correct thresholds
- [ ] Damage applies correctly
- [ ] Burn effect applies and ticks
- [ ] Slow effect applies and expires
- [ ] Animation frames update
- [ ] No regressions in game behavior
