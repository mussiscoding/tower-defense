---
title: "feat: Add New Enemy Types (Beast, Slime, Slow Giant)"
type: feat
status: completed
date: 2026-03-12
---

# New Enemy Types: Beast, Slime, Slow Giant

## Overview

Add an enemy type system and three new enemy types to break up wave monotony. A fast wolf-like beast, a splitter slime that spawns children on death, and slow giants. All types — including giants — are mixed into normal waves through a unified type substitution system, replacing the legacy `generateGiantWave` separate code path.

**Sprites:** Beast and slime SVG sprites are done (`beast-sprites.ts`, `slime-sprites.ts`). Both use fixed color palettes (no `colorIndex` variants like goblins). Same 3-frame animation pattern (left/middle/right) as existing goblin sprites.

## Problem Statement / Motivation

Currently all enemies are goblins with different HP/color. Giants exist but are handled as a completely separate wave type (`generateGiantWave`) — a solo enemy that consumes the entire wave budget. This legacy pattern doesn't scale: adding more types would mean more special-case wave generators. We need a unified type system where any enemy in a wave can be any type, creating mixed waves with visual variety.

## Proposed Solution

1. **Unified enemy type system** — Replace `isGiant` boolean and `generateGiantWave` with an `enemyType` field and a post-generation type substitution pass
2. **Three types mixed into normal waves:** giant (slow tank), beast (fast glass cannon), slime (splits on death)
3. **Type substitution** — Generate a normal wave, then roll to replace individual enemies with typed variants based on difficulty thresholds

## Design Decisions

| Decision                          | Choice                                           | Rationale                                                                |
| --------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| Wave generation approach          | Generate normal wave, then substitute types      | One code path for all waves — no special-case generators                 |
| Giant handling                    | Same substitution system as beast/slime          | Giants are just another type, not a separate wave mode                   |
| Giant budget                      | Single enemy gets ~1.5x its normal HP allocation | Keeps the "tank" feel without needing a whole wave's budget              |
| Splitter at castle                | Does NOT split                                   | Castle removal isn't "death" — avoids 15 damage from one enemy           |
| Splitter children spawning        | Immediate (same tick)                            | Simpler, and the visual "pop then rush" feels right for idle             |
| Status effect inheritance         | Children spawn clean                             | No burn/slow/vortex transfer — simpler, less surprising                  |
| Child spawn position              | Parent ± 15px Y offset                           | Prevents complete overlap, makes split visually apparent                 |
| Slime parent visual scale         | `scale(1.3)`                                     | Larger than goblins — chunky feel before the pop                         |
| Slime child visual scale          | `scale(0.7)`                                     | Visually smaller but still readable                                      |
| Fast beast speed                  | Fixed 2x                                         | From brainstorm's 2-3x range                                             |
| Splitter budget cost              | 2x parent HP                                     | Accounts for total effective HP (parent + 2 half-HP children)            |
| Gold formula                      | Standard `ceil(health/2)` for all                | Splitter family total: parent gold + 2 × child gold — naturally balanced |
| In-flight arrows at dead splitter | Miss (no retarget)                               | Consistent with existing dead-target behavior                            |

### Type Selection: Weighted Random

Each enemy in a wave gets a single weighted random roll to determine its type. The weight table grows as difficulty unlocks new types — but once a type is unlocked, weights stay fixed. What you write is what you get, no ordering bias.

| Type   | Weight | Unlocks at     | Notes                                              |
| ------ | ------ | -------------- | -------------------------------------------------- |
| Goblin | 20     | Always         | Default enemy                                      |
| Beast  | 5      | Difficulty 2+  | HP × 0.5, speed 2x                                 |
| Giant  | 1      | Difficulty 5+  | HP × 1.5, speed 0.7x                               |
| Slime  | 2      | Difficulty 10+ | HP halved (2x effective from children), speed 0.9x |

**Example distributions:**

| Difficulty | Available types | Goblin | Beast | Giant | Slime |
| ---------- | --------------- | ------ | ----- | ----- | ----- |
| 1          | Goblin only     | 100%   | —     | —     | —     |
| 2+         | +Beast          | 80%    | 20%   | —     | —     |
| 5+         | +Giant          | 76.9%  | 19.2% | 3.8%  | —     |
| 10+        | +Slime          | 71.4%  | 17.9% | 3.6%  | 7.1%  |

Multiple types can appear in the same wave. A wave at difficulty 10+ could have goblins, a giant, some beasts, and a slime all together.

## Technical Approach

### Phase 1: Unified Type System & Wave Refactor

**Replace `isGiant` with `enemyType`. Refactor wave generation to use type substitution instead of separate giant waves.**

#### `src/types/GameState.ts`

- Add `EnemyType` union: `"goblin" | "giant" | "beast" | "slime" | "slime_child"`
- Add `enemyType?: EnemyType` to `Enemy` interface (optional, defaults to `"goblin"` for backward compat)
- `isGiant` field remains for now (derived from `enemyType === "giant"` during transition, or set alongside `enemyType`) — can deprecate later

#### `src/utils/gameLogic/enemy.ts`

- Add `enemyType` and `speed` to `CreateEnemyOptions`
- Pass speed through to the created enemy (currently hardcoded to 1)
- Default speed remains 1, default type remains `"goblin"`

#### `src/utils/gameLogic/waveGenerator.ts` — **Major refactor**

Delete `generateGiantWave`. Replace with a unified approach:

1. `generateWave()` calls `generateFixedBudgetWave()` as normal (no more giant early-return)
2. New function `applyTypeSubstitutions(enemies: WaveEnemy[], difficulty: number): WaveEnemy[]`
   - Builds a weight table based on difficulty (goblin always included, others added at their threshold)
   - For each enemy: single weighted random pick from the table
   - Applies type-specific stat modifiers:
     - **Giant**: HP × 1.5, speed 0.7, `enemyType: "giant"`, `isGiant: true`
     - **Beast**: HP × 0.5, speed 2, `enemyType: "beast"`
     - **Slime**: HP halved (effective 2x from children), speed 0.9, `enemyType: "slime"`
     - **Goblin**: no changes
3. Add `enemyType`, `speed` fields to `WaveEnemy` interface

Weight table is simple data — easy to tune and extend with new types later. Waves naturally get more varied as difficulty unlocks new types.

#### `src/utils/saveSystem.ts`

- Add migration in `loadGame()`: enemies without `enemyType` default to `"goblin"`, enemies with `isGiant: true` get `enemyType: "giant"`

### Phase 2: Sprites & Rendering

**New sprites for beast and slime. Update rendering to use `enemyType` instead of just `isGiant`.**

#### Sprites — already done

- `src/assets/enemies/beast-sprites.ts` — `generateBeastSprite()`: 4-legged wolf, brown palette, 3-frame walk cycle, no parameters
- `src/assets/enemies/slime-sprites.ts` — `generateSlimeSprite()`: green blob, 3-frame wobble cycle, no parameters
- Neither takes `colorIndex` — all beasts look the same, all slimes look the same (unlike goblins with 12 shirt colors)
- Same `{ left, middle, right }` SVG string format as `generateGoblinSprite`

#### `src/components/EnemySprite.tsx`

- Accept `enemyType` prop
- Select sprite generator: `goblin`/`giant` → `generateGoblinSprite`, `beast` → `generateBeastSprite`, `slime`/`slime_child` → `generateSlimeSprite`

#### `src/components/Enemy.tsx`

- Pass `enemyType` to `EnemySprite`
- Refactor scale logic: instead of just `isGiant ? 2 : 1`, use a scale map: `{ giant: 2, slime: 1.3, slime_child: 0.7, default: 1 }`
- Handle type-specific visual effect offsets (burn/slow particle positions)

### Phase 3: Splitter Death Mechanic

**The most complex piece — splitter slimes spawn children on death.**

#### `src/utils/gameLogic/enemy.ts`

- Add `spawnSplitterChildren(parent: Enemy): Enemy[]` function
  - Creates 2 children at parent position ± 15px Y offset
  - Children get: half parent HP, same speed, `enemyType: "slime_child"`, fresh ID
  - Children do NOT inherit burn/slow/vortex effects
  - Children do NOT split on death (type is `"slime_child"`, not `"slime"`)

#### `src/components/GameArea.tsx` — **3 death paths need updating**

All three death-handling locations must call `spawnSplitterChildren` when a slime dies:

1. **Burn kills** (~line 149-158): After removing dead enemy, check if slime → spawn children into enemies array
2. **Arrow kills** (~line 255-264): After `processArrowImpacts` returns killed enemies, check each for slime → spawn children
3. **Splash kills** (~line 277-285): After splash damage mutation kills, check if slime → spawn children

For each path: check `enemy.enemyType === "slime"`, call `spawnSplitterChildren`, add results to enemies array.

### Arrow Prediction & Fast Beasts

The arrow targeting system at `src/utils/gameLogic/uiUtils.ts:118` predicts enemy position using `target.speed`:

```
predictedX = target.x - (target.speed * flightTime) / 50
```

This math scales correctly with speed — a 2x beast will get a prediction 2x further ahead. However:

- **Verify visually** that arrows don't overshoot fast beasts (prediction accuracy degrades with distance)
- **Check arrow speed vs beast speed** — if beasts are fast enough, slow-attacking defenders (Earth at 0.5 attack speed) may fire arrows that can never catch up, since the beast moves further in the arrow's flight time than the prediction accounts for at long range
- **Splash targeting** (`src/utils/gameLogic/targeting.ts`) also uses predicted positions — verify splash optimization still works with mixed-speed enemy groups

### Phase 4: Polish & Tuning

- Playtest arrow accuracy against 2x speed beasts at various defender positions
- Test all skill interactions (onHit, onEnemyDeath handlers) with new types
- Tune difficulty thresholds and spawn rates based on playtesting
- Consider split visual effect (particle burst / brief flash) if it feels too abrupt
- Verify save/load roundtrip with all new enemy types mid-wave
- Playtest mixed-type waves — do they feel good? Too chaotic? Adjust spawn rates

## System-Wide Impact

- **Wave generation refactor:** Removing `generateGiantWave` and the giant early-return in `generateWave` is the biggest structural change. All waves now flow through the same path with type substitution applied after. This is cleaner long-term but touches the core wave logic.
- **`isGiant` deprecation path:** During transition, set both `isGiant: true` and `enemyType: "giant"` on giants. Components that currently check `isGiant` continue to work. Can migrate them to check `enemyType` incrementally and eventually drop `isGiant`.
- **Death handling:** Three separate death paths in GameArea.tsx all need splitter awareness. This is the highest-risk area — missing one path means silent bugs where slimes don't split from certain damage types.
- **Predicted damage tracking:** Maps track predicted damage per enemy ID. Splitter children get new IDs, so they start fresh with no predictions. Existing arrows targeting the dead parent will miss — this is fine and consistent.
- **Arrow targeting / splash:** Earth splash damage from killing a slime could theoretically hit its own children in the same tick (if children are spawned immediately). This is acceptable — it creates a natural "chain reaction" feel.
- **Save/load:** New `enemyType` field needs backward compatibility. Old saves: missing field defaults to `"goblin"`, `isGiant: true` maps to `enemyType: "giant"`.

## Acceptance Criteria

### Phase 1: Unified Type System & Wave Refactor

- [x] `EnemyType` union type exists in `GameState.ts`
- [x] `enemyType` field on `Enemy` interface
- [x] `generateGiantWave` removed — giants created via type substitution
- [x] `applyTypeSubstitutions` function generates mixed-type waves
- [x] Giants spawn with `speed: 0.7` and `enemyType: "giant"`
- [ ] Giants visibly move slower than regular enemies
- [x] Mixed waves possible at higher difficulties (goblins + giants + beasts)
- [x] Old saves load without errors (missing `enemyType` defaults to `"goblin"`, `isGiant` maps to `"giant"`)

### Phase 2: Sprites & Rendering

- [x] Beast sprite integrated (`generateBeastSprite` from `beast-sprites.ts`)
- [x] Slime sprite integrated (`generateSlimeSprite` from `slime-sprites.ts`)
- [x] `EnemySprite` selects correct sprite generator based on `enemyType`
- [x] Scale logic uses `enemyType` (giant: 2x, slime: 1.3x, slime_child: 0.7x, others: 1x)
- [ ] Burn/slow/vortex visual effects position correctly on all types
- [ ] All sprite types animate correctly (3-frame walk cycle)

### Phase 3: Splitter Slime

- [x] Slime death from arrows spawns 2 children
- [x] Slime death from burn spawns 2 children
- [x] Slime death from splash spawns 2 children
- [x] Children have half parent HP, `enemyType: "slime_child"`, don't re-split
- [x] Children spawn at parent position ± 15px Y offset
- [x] Children render at 0.7x scale
- [x] Slime reaching castle does NOT split (just takes damage and is removed)
- [x] Children do NOT inherit status effects from parent
- [x] Wave budget correctly accounts for 2x effective HP of splitters

### Phase 4: Polish

- [x] Beasts move at 2x speed with low HP
- [ ] Arrow prediction works correctly with 2x speed beasts
- [ ] Mixed-type waves feel good at various difficulty levels
- [ ] Save/load roundtrip works with all enemy types mid-wave

## References

### Internal

- Brainstorm: `planning_docs/In progress/new-enemy-types-brainstorm.md`
- Enemy interface: `src/types/GameState.ts:31-53`
- Enemy creation: `src/utils/gameLogic/enemy.ts:12-32`
- Death handling (burn): `src/components/GameArea.tsx:149-158`
- Death handling (arrow): `src/components/GameArea.tsx:255-264`
- Death handling (splash): `src/components/GameArea.tsx:277-285`
- Wave generation: `src/utils/gameLogic/waveGenerator.ts`
- Arrow prediction: `src/utils/gameLogic/uiUtils.ts:118`
- Goblin sprite: `src/assets/enemies/enemy-sprites.ts`
- Beast sprite: `src/assets/enemies/beast-sprites.ts`
- Slime sprite: `src/assets/enemies/slime-sprites.ts`
- Sprite component: `src/components/EnemySprite.tsx`
- Enemy component: `src/components/Enemy.tsx`
- Save system: `src/utils/saveSystem.ts`
