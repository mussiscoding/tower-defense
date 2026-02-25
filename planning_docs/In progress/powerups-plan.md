# Power-Ups System

## Overview

Clickable power-ups that spawn randomly on the battlefield. The player clicks them before they expire to activate a temporary buff or collect an instant reward. Adds an active/engaged layer to the idle gameplay.

---

## How They Work

### Spawning
- Appear at a random position in the game area (not overlapping castle or mage zones)
- Spawn every 20-40 seconds (randomized interval)
- Only 1 power-up on screen at a time
- Float/bob gently with a glow effect to draw attention
- Despawn after 8-10 seconds if not clicked

### Player Interaction
- Player clicks the power-up icon on the battlefield
- Brief flash/burst animation on click
- Buff icon appears in a small HUD bar (top of game area or below header) showing active buffs + remaining duration
- If the power-up expires without being clicked, it fades away - no penalty

### Visual Design
- Circular icons with a pulsing glow border
- Color-coded by type (gold = wealth, red = damage, blue = speed, etc.)
- Slight bounce/float animation while on screen
- Timer ring around the icon showing time remaining before despawn

---

## Power-Up Ideas

### Damage Buffs
| Power-Up | Effect | Duration | Color |
|---|---|---|---|
| Fury | 2x damage for all mages | 30s | Red |
| Elemental Surge | 3x damage for one random element | 20s | Element color |
| Critical Frenzy | All attacks are critical hits | 15s | Orange |
| Piercing Shots | Arrows pass through enemies (hit 2 targets) | 20s | Purple |

### Speed Buffs
| Power-Up | Effect | Duration | Color |
|---|---|---|---|
| Rapid Fire | 2x attack speed for all mages | 25s | Yellow |
| Haste | Arrows travel 3x faster | 20s | Cyan |
| Quick Draw | All skill cooldowns reduced by 50% | 30s | Light blue |

### Gold & Economy
| Power-Up | Effect | Duration | Color |
|---|---|---|---|
| Gold Rush | Instant gold drop (scales with difficulty) | Instant | Gold |
| Midas Touch | 2x gold from enemy kills | 30s | Gold |
| Treasure Chest | Large gold drop (5x normal Gold Rush) | Instant | Gold sparkle |

### Defensive / Utility
| Power-Up | Effect | Duration | Color |
|---|---|---|---|
| Frost Nova | Slow all enemies on screen by 50% | 10s | Ice blue |
| Castle Shield | Castle takes no damage | 20s | White |
| Earthquake | Deal damage to all enemies on screen (% of max HP) | Instant | Brown |
| Time Warp | Enemies move at half speed | 15s | Purple |

### XP & Progression
| Power-Up | Effect | Duration | Color |
|---|---|---|---|
| Wisdom | 2x XP gain for all elements | 30s | Green |
| Mentorship | 3x XP for lowest-level element | 30s | Green glow |

---

## Data Model

```typescript
interface PowerUpDef {
  id: string;
  name: string;
  description: string;
  icon: string;      // emoji or sprite reference
  color: string;     // glow/border color
  duration: number;  // 0 = instant, otherwise ms
  effect: (state: GameState) => void;       // apply on click
  removeEffect?: (state: GameState) => void; // undo when duration expires
  spawnWeight: number; // relative probability (higher = more common)
}

interface ActivePowerUp {
  id: string;
  powerUpId: string;
  startTime: number;
  duration: number;
}

interface SpawnedPowerUp {
  id: string;
  powerUpId: string;
  x: number;
  y: number;
  spawnTime: number;
  despawnTime: number; // spawnTime + 8-10s
}

// In GameState slices:
// EntityState: spawnedPowerUp: SpawnedPowerUp | null
// CoreState: activePowerUps: ActivePowerUp[]
```

## Implementation Approach

### "Baking" Buffs (like star damage)
For multiplier buffs (2x damage, 2x gold), the cleanest approach mirrors how star damage works - bake the multiplier into the stat being affected, then un-bake when the buff expires. This avoids threading power-up checks through combat code.

### Instant Effects
Gold drops and earthquake-style effects just mutate state directly on click - no duration tracking needed.

### Spawn Logic
- Track `lastPowerUpSpawnTick` in GameLoopMeta
- Every tick, check if enough time has passed and no power-up is currently on screen
- Random roll against spawn interval (20-40s)
- Weighted random selection from the power-up pool

---

## Open Questions

- Should power-up frequency increase with difficulty?
- Should some power-ups be rarer / only appear at higher difficulties?
- Should there be a "power-up magnet" upgrade that auto-collects them?
- Visual: do we want particle trails or just simple icons?
- Should power-ups stack? (e.g., click two Fury buffs = still 2x, or 4x?)
- Mobile consideration: power-ups need to be large enough to tap on mobile
