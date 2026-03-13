---
date: 2026-03-12
topic: new-enemy-types
---

# New Enemy Types — Brainstorm

## What We're Building

Three new enemy types to break up wave monotony and create more "oh what's THAT" moments like giants currently provide. The goal is variety and visual surprise, not strategic puzzle-solving (players don't control targeting).

## Enemy Types

### 1. Fast Beast (Wolf / 4-legged creature)

- **Speed:** 2-3x normal
- **HP:** Low (compensates for speed)
- **Visual:** Distinct 4-legged silhouette — must look different from goblins at a glance
- **Wave integration:** Common spawn, mixed into normal waves at moderate difficulty
- **Feel:** A blur rushing across the screen, forces you to notice something different is happening

### 2. Splitter (Slime)

- **Speed:** Same or slightly slower than normal (big slime is sluggish)
- **HP:** Higher than normal (needs to feel chunky before it pops)
- **Visual:** Blob/slime shape, wobbly animation, visually distinct silhouette
- **Mechanic:** On death, splits into 2 smaller non-splitting children with half parent HP
- **Children:** Same speed as parent, smaller visual scale, same slime sprite
- **Wave integration:** Uncommon spawn, appears at higher difficulties
- **Feel:** Satisfying pop moment, then "oh no there's more"

### 3. Slow Giant (existing giant, tuned)

- **Speed:** Slower than normal (0.5x or similar)
- **HP:** Already high from giant budget (1.5x wave budget)
- **Visual:** No changes needed — existing giant sprite at 2x scale
- **Mechanic:** Just reduce speed on existing giants
- **Implementation:** Minimal — set speed multiplier in giant wave generation
- **Feel:** Lumbering tank you chip away at over time

## Visual Approach

**Primary plan:** New SVG sprites for beast and slime — distinct silhouettes are key to instant recognition.

**Fallback plan:** If SVG sprite quality isn't good enough, fall back to color-coded existing goblin sprites (e.g., blue for fast, green for slime).

**Implementation order:** Assess SVG sprite quality FIRST before building mechanics. If sprites don't look right, pivot to color approach immediately.

## Pocketed Ideas (Future)

### Goblin Truck
- Fast-moving vehicle/cart carrying goblins
- On death, spills out ~6 normal goblins
- Inverse of slime: fast parent, many children (vs slow parent, few children)
- Could be a great mid-game surprise

### Double Splitter
- Splitter children can themselves split
- 1 -> 2 -> 4 enemies from a single kill
- Save for when base splitter is proven fun

### Healer
- Green halo/glow, robed figure
- Pulses heal to nearby enemies
- Revisit after click-to-damage is implemented (gives player ability to manually target them)
- Green rings pulsing outward as visual

### Other Ideas Considered
- **Ghost/Wraith** — phases in/out, untargetable while faded
- **Shield Bearer** — absorbs first N hits, shield breaks visually
- **Bat Swarm** — cluster of tiny sprites, very low HP each
- **Tunneler** — only targetable when surfaced

## Implementation Notes

- Add `enemyType` field to Enemy interface (e.g., `"goblin" | "beast" | "slime" | "slime_child"`)
- Type determines: speed multiplier, HP multiplier, special behavior, sprite
- Wave generator picks types based on difficulty thresholds
- Each type needs its own sprite generator function in `enemy-sprites.ts`
- Splitter death logic goes in `enemy.ts` death handling — spawn 2 children at parent position
- Slow giant is just a speed tweak in `waveGenerator.ts`

## Next Steps

-> `/workflows:plan` for implementation plan, starting with SVG sprite quality assessment
