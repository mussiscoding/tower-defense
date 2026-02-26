---
date: 2026-02-26
topic: wave-hp-distribution
---

# Wave HP Distribution Rework

## Problem

Damage upgrades feel irrelevant because of how HP is distributed across waves:
- **Mid-game:** One high-HP enemy + many trivial ones. Damage upgrades help kill the big one but are overkill for the rest.
- **Late-game:** Wave HP budget exceeds the max enemy tier (20,480 HP), creating floods of enemies. Mages can't keep up regardless of damage because they're mostly single-target.

Root cause: the fixed enemy tier system (12 types with 2x HP doubling) constrains wave composition, and the composition algorithm (1/3 minimum floor) creates top-heavy distributions.

## What We're Building

### Remove the enemy tier system
- Enemies no longer have fixed HP types (10, 20, 40... 20,480)
- Instead, each enemy gets an arbitrary HP value based on wave parameters
- Shirt color is randomly assigned (cosmetic only)
- Giant enemies remain as the existing mini-boss mechanic (separate system)
- Future: add visual distinction for higher HP enemies, but not now

### Bell curve HP distribution
- Enemy HP within a wave follows a normal distribution
- **Mean** scales with difficulty (this is what makes waves harder)
- **Standard deviation** = ~30-35% of mean (enough variety, not back to one-big-many-small)
- **Min HP floor** = `max(10, mean × 0.3)`
- **Max HP cap** = `mean × 2`

### Two composition modes (for testing)

**Mode: fixed-budget (Option 2)**
- Total wave HP budget scales with difficulty: `50 × 1.3^(difficulty-1)`
- Pick enemy count: random 4-8
- Divide budget across enemies using bell curve variance
- Mean = budget / enemyCount
- More predictable difficulty progression

**Mode: fixed-mean (Option 3)**
- Mean HP per enemy scales with difficulty
- Pick enemy count: random 4-8
- Each enemy's HP drawn independently from bell curve
- Total wave HP varies naturally (a wave of 8 is ~double a wave of 4)
- More interesting variance — some waves are breathers, some are brutal

Both modes share the same bell curve logic, just anchored differently.

## Why This Approach

- **Simplifies the codebase** — removes 12 enemy type definitions and lookup logic
- **Solves the damage relevance problem** — enemies are uniformly challenging within a wave
- **Solves the late-game flood** — 4-8 enemies per wave regardless of difficulty
- **Makes wave composition trivially flexible** — no constraints from fixed HP buckets
- **Easy to test both modes** — single parameter swap

## Key Decisions

- **Remove tier system entirely**: Shirt color was not communicating HP to players. Giants already serve the "big enemy" visual role.
- **Bell curve over uniform**: Adds natural variety without extreme outliers.
- **σ = 30-35% of mean**: Sweet spot between monotony and the original problem.
- **Min floor, max cap**: Prevents degenerate rolls (trivial enemies on late waves, one absurdly tanky enemy).
- **4-8 enemy count**: Enough to feel like a wave, few enough that mages can handle it.

## What Stays the Same

- Gold per enemy: `Math.ceil(health / 2)` — based on HP, still works
- XP: 1 per damage dealt per element — still works
- All skills: reference HP/damage/position, not enemy type — still works
- Giant enemies: separate mechanic, untouched
- Difficulty scaling rate: 1.3x per wave (unchanged for fixed-budget mode)

## Open Questions

- Exact σ value (30% vs 35%) — tune through playtesting
- Whether fixed-budget or fixed-mean feels better — that's why we build both
- Long-term visual distinction for high HP enemies (deferred)

## Next Steps

This is part of a three-part improvement:
- **A) Scale enemies beyond 20K HP** — solved by removing tiers entirely
- **B) Better HP distribution** — this brainstorm (implement first)
- **C) Throughput skills (AoE/multi-target)** — separate design project for the 9+ TBD skill slots
