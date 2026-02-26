# Power-Ups System

## Overview

Clickable power-ups that spawn randomly on the battlefield. The player clicks them before they expire to activate a temporary buff or collect an instant reward. Rewards active play.

---

## How They Work

### Spawning

- Appear at a random position in the game area (x > `CASTLE_WIDTH`, within y bounds)
- Spawn every 60-120 seconds (randomized interval)
- Only 1 power-up on screen at a time
- Float/bob gently with a glow effect to draw attention
- Despawn after 8-10 seconds if not clicked

### Player Interaction

- Player clicks the power-up icon on the battlefield
- **Power-up clicks take priority over enemy clicks** — if a power-up overlaps an enemy, clicking collects the power-up
- Brief flash/burst animation on click
- Buff icon appears in a small HUD bar showing active buffs + remaining duration
- If the power-up expires without being clicked, it fades away — no penalty

### Buff Behavior

- **Buff timers use real time** — they continue ticking during pause (this is fine)
- **Buffs stack** — two Fury buffs = 4x damage. Unlikely but fun when it happens
- **Castle death clears everything** — all active buffs and any spawned power-up are removed on castle death

### Visual Design

- Circular icons with a pulsing glow border
- Color-coded by type (gold = wealth, red = damage, yellow = speed, green = XP)
- Slight bounce/float animation while on screen
- Timer ring around the icon showing time remaining before despawn

---

## Power-Ups

### Phase 1 (Initial Implementation)

| Power-Up    | Effect                        | Duration | Color | Weight |
| ----------- | ----------------------------- | -------- | ----- | ------ |
| Fury        | 2x damage for all mages      | 30s      | Red   | 10     |
| Gold Rush   | Instant gold drop             | Instant  | Gold  | 15     |
| Midas Touch | 2x gold from enemy kills     | 30s      | Gold  | 10     |
| Wisdom      | 2x XP gain for all elements  | 30s      | Green | 10     |

### Phase 2 (Future Additions)

| Power-Up        | Effect                              | Duration | Color         | Weight |
| --------------- | ----------------------------------- | -------- | ------------- | ------ |
| Elemental Surge | 3x damage for one random element    | 20s      | Element color | 8      |
| Rapid Fire      | 2x attack speed for all mages       | 25s      | Yellow        | 8      |
| Treasure Chest  | Large gold drop (5x Gold Rush)      | Instant  | Gold sparkle  | 3      |
| Mentorship      | 3x XP for lowest-level element      | 30s      | Green glow    | 8      |
| Study Session   | Instant XP for lowest-level element | Instant  | Dark green    | 10     |

### Gold Rush Formula

Linear scaling from total gold earned:

```
goldDrop = Math.floor(totalGoldEarned * 0.05) + 50
```

Base of 50g so it's useful early game. The 5% scales up naturally — a player with 10,000 total gold earned gets 550g, a player with 100,000 gets 5,050g. Treasure Chest (Phase 2) is simply `goldDrop * 5`.

---

## Data Model

```typescript
interface PowerUpDef {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or sprite reference
  color: string; // glow/border color
  duration: number; // 0 = instant, otherwise ms
  applyEffect: (state: GameState) => void; // runs on click
  spawnWeight: number; // relative probability (higher = more common)
}

interface ActivePowerUp {
  id: string;
  powerUpId: string; // references PowerUpDef.id
  startTime: number; // Date.now() when collected
  duration: number; // ms, from PowerUpDef
}

interface SpawnedPowerUp {
  id: string;
  powerUpId: string;
  x: number;
  y: number;
  spawnTime: number;
  despawnTime: number; // spawnTime + 8-10s
}

// GameState additions:
// EntityState.spawnedPowerUp: SpawnedPowerUp | null
// CoreState.activePowerUps: ActivePowerUp[]
```

---

## Implementation Approach

### Runtime Multipliers (NOT Baking)

Do **not** bake power-up multipliers into `baseStats.damage` like stars do. Instead, use helper functions that check `activePowerUps` at the point of use:

```typescript
function getDamageMultiplier(activePowerUps: ActivePowerUp[]): number {
  let multiplier = 1;
  for (const buff of activePowerUps) {
    if (buff.powerUpId === "fury") multiplier *= 2;
    // Phase 2: elemental surge handled separately with element check
  }
  return multiplier;
}

function getGoldMultiplier(activePowerUps: ActivePowerUp[]): number {
  let multiplier = 1;
  for (const buff of activePowerUps) {
    if (buff.powerUpId === "midas_touch") multiplier *= 2;
  }
  return multiplier;
}

function getXPMultiplier(activePowerUps: ActivePowerUp[]): number {
  let multiplier = 1;
  for (const buff of activePowerUps) {
    if (buff.powerUpId === "wisdom") multiplier *= 2;
  }
  return multiplier;
}
```

**Why not baking:** If the game saves during a buff and the player closes the tab before the buff expires, baked values persist forever. Runtime multipliers are crash-safe — when the buff expires or is cleared on load, the multiplier simply stops applying.

### Applying Multipliers Across All Kill Paths

Gold and XP are awarded in **4 separate places** in the game loop. Multipliers must be applied consistently at all of them:

1. **Burn kills** (~GameArea line 128)
2. **Arrow kills** (~GameArea line 287)
3. **Splash kills** (~GameArea line 251)
4. **Click kills** (~GameArea line 366)

Each of these points calls the relevant multiplier helper before adding gold/XP to state.

### Instant Effects

Gold Rush and Treasure Chest mutate `state.core.gold` and `state.core.totalGoldEarned` directly on click. No duration tracking, no entry in `activePowerUps`.

### Spawn Logic

- Add `lastPowerUpSpawnTick` to `GameLoopMeta`
- Each tick: if no `spawnedPowerUp` exists and enough ticks have elapsed, roll for a spawn
- Spawn interval: 1200-2400 ticks (60-120 seconds at 50ms/tick)
- Weighted random selection from the power-up pool using `spawnWeight`
- Random position: x in `[CASTLE_WIDTH + 50, WIDTH - 50]`, y in `[80, 520]` (with padding)

### Expiry & Cleanup

- **Spawned power-up despawn**: Each tick, check if `currentTime > spawnedPowerUp.despawnTime`. If so, set `spawnedPowerUp = null`.
- **Active buff expiry**: Each tick, filter `activePowerUps` to remove entries where `Date.now() > startTime + duration`.
- **Castle death**: Set `spawnedPowerUp = null` and `activePowerUps = []`.

### Save/Load

- `activePowerUps` lives in `CoreState`, so it's saved automatically.
- On load, filter out expired power-ups: `activePowerUps.filter(p => Date.now() < p.startTime + p.duration)`.
- `spawnedPowerUp` lives in `EntityState` and is **not saved** (transient, like arrows). On load, no power-up is on screen — one will spawn naturally after the interval.

### Click Handling

- Power-up click detection happens **before** enemy click detection in the game area click handler.
- Check if click coords are within the power-up's radius (~30px from center).
- On click: run `applyEffect(state)`, add to `activePowerUps` if duration > 0, set `spawnedPowerUp = null`, trigger pickup animation.

---

## Phase 1 Implementation Steps

1. **Data model & types** — Add `PowerUpDef`, `ActivePowerUp`, `SpawnedPowerUp` types. Add fields to `CoreState` and `EntityState`.
2. **Power-up definitions** — Create `src/data/powerups.ts` with the 4 Phase 1 power-ups.
3. **Multiplier helpers** — Create `src/utils/gameLogic/powerups.ts` with `getDamageMultiplier`, `getGoldMultiplier`, `getXPMultiplier`.
4. **Wire multipliers into game loop** — Apply at all 4 kill paths for gold, at XP grant points for XP, and at damage calculation for damage.
5. **Spawn logic** — Add spawn check to game loop, add `lastPowerUpSpawnTick` to `GameLoopMeta`.
6. **Expiry logic** — Add buff expiry check and despawn check to game loop.
7. **Click handling** — Add power-up click detection before enemy click detection.
8. **UI: spawned power-up** — Render the floating power-up icon on the game area with bounce/glow animation.
9. **UI: active buffs HUD** — Small bar showing active buff icons with remaining duration.
10. **Save/load** — Filter expired buffs on load, default empty arrays for missing fields.
11. **Castle death** — Clear power-ups in the castle death handler.

---

## Open Questions

- Should power-up frequency increase with difficulty/wave number?
- Should some power-ups only unlock at higher difficulty levels?
- Should there be a future upgrade/skill that auto-collects power-ups?
- Visual: particle trails or simple icons? (start simple, polish later)
