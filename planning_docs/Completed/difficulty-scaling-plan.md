# Difficulty Scaling Plan - Progression Speed Adjustments

## Problem Statement

The player can reach difficulty 50 in 5 minutes with level 30 elements. The issue is that progression is too fast, not that difficulty scaling is wrong.

## Root Cause Analysis

1. **Element XP requirements too low**: Players can reach high element levels too quickly
2. **Gold scaling too generous**: Players can afford upgrades too easily
3. **Initial costs too low**: Strong upgrades (like earth radius) are too cheap

## Proposed Solutions

### 1. Increased XP Requirements for Element Levels

#### Current XP Formula Analysis

```typescript
// Current formula from elements.ts
export const getXPForNextLevel = (level: number): number => {
  return Math.floor((level - 1 + 300 * Math.pow(2, (level - 1) / 7)) / 4);
};
```

#### XP Requirements by Level (Current)

- Level 1→2: 75 XP
- Level 2→3: 83 XP
- Level 3→4: 91 XP
- Level 4→5: 101 XP
- Level 5→6: 112 XP
- Level 6→7: 124 XP
- Level 7→8: 137 XP
- Level 8→9: 151 XP
- Level 9→10: 167 XP
- Level 10→11: 185 XP
- Level 11→12: 204 XP
- Level 12→13: 225 XP
- Level 13→14: 249 XP
- Level 14→15: 274 XP
- Level 15→16: 303 XP
- Level 16→17: 334 XP
- Level 17→18: 369 XP
- Level 18→19: 408 XP
- Level 19→20: 450 XP
- Level 20→21: 496 XP
- Level 21→22: 548 XP
- Level 22→23: 605 XP
- Level 23→24: 667 XP
- Level 24→25: 737 XP
- Level 25→26: 813 XP
- Level 26→27: 897 XP
- Level 27→28: 990 XP
- Level 28→29: 1,093 XP
- Level 29→30: 1,207 XP
- Level 30→31: 1,332 XP

**Total XP to reach level 30: 13,427 XP**

#### Proposed New XP Formula

```typescript
export const getXPForNextLevel = (level: number): number => {
  // 1.3x exponential scaling: gives approximately 100x increase
  return Math.floor(200 * Math.pow(1.3, level - 1));
};
```

#### XP Requirements by Level (Proposed)

- Level 1→2: 200 XP
- Level 2→3: 260 XP
- Level 3→4: 338 XP
- Level 4→5: 439 XP
- Level 5→6: 571 XP
- Level 6→7: 742 XP
- Level 7→8: 965 XP
- Level 8→9: 1,254 XP
- Level 9→10: 1,631 XP
- Level 10→11: 2,120 XP
- Level 11→12: 2,757 XP
- Level 12→13: 3,584 XP
- Level 13→14: 4,659 XP
- Level 14→15: 6,057 XP
- Level 15→16: 7,874 XP
- Level 16→17: 10,237 XP
- Level 17→18: 13,308 XP
- Level 18→19: 17,300 XP
- Level 19→20: 22,491 XP
- Level 20→21: 29,238 XP
- Level 21→22: 38,009 XP
- Level 22→23: 49,412 XP
- Level 23→24: 64,236 XP
- Level 24→25: 83,507 XP
- Level 25→26: 108,560 XP
- Level 26→27: 141,128 XP
- Level 27→28: 183,466 XP
- Level 28→29: 238,506 XP
- Level 29→30: 310,058 XP
- Level 30→31: 403,076 XP

#### Time Analysis for Level 30

- **Current**: 13,427 XP total to reach level 30
- **Proposed**: 1,745,983 XP total to reach level 30
- **Time impact**: ~130x longer to reach level 30 (close to target 100x)

### 2. Increased Cost Scaling (No Gold Changes)

#### Current Tower Costs

- **Fire Mage**: 50 gold
- **Ice Mage**: 75 gold
- **Earth Mage**: 100 gold
- **Air Mage**: 125 gold

_Note: With exponential cost scaling, different initial costs don't make sense_

#### Current Upgrade Costs

- **Fire burn damage**: 200 gold (1.15x scaling)
- **Fire burn duration**: 300 gold (1.2x scaling) ← **Useless (enemies keep getting hit)**
- **Ice slow effect**: 200 gold (1.15x scaling)
- **Ice slow duration**: 300 gold (1.2x scaling) ← **Useless (enemies keep getting hit)**
- **Earth splash damage**: 200 gold (1.15x scaling)
- **Earth splash radius**: 300 gold (1.2x scaling) ← **Very strong for the cost**
- **Air burst shots**: 200 gold (1.15x scaling)
- **Air burst cooldown**: 300 gold (1.2x scaling)

#### Proposed Cost Changes

##### Tower Cost Scaling

```typescript
// Standardize all tower costs to 100 gold
// Double the cost scaling factor for all towers
costScalingFactor: 2.0, // Instead of 1.25
```

**Tower Cost Progression:**

- **Fire Mage**: 100 → 200 → 400 → 800 → 1600 → 3200 → 6400...
- **Ice Mage**: 100 → 200 → 400 → 800 → 1600 → 3200 → 6400...
- **Earth Mage**: 100 → 200 → 400 → 800 → 1600 → 3200 → 6400...
- **Air Mage**: 100 → 200 → 400 → 800 → 1600 → 3200 → 6400...

##### Upgrade Cost Scaling

```typescript
// Double the cost scaling factor for all upgrades
costScalingFactor: 2.0, // Instead of 1.15/1.2
```

**Upgrade Cost Progression:**

- **Fire burn damage**: 1000 → 2000 → 4000 → 8000 → 16000...
- **Ice slow effect**: 1000 → 2000 → 4000 → 8000 → 16000...
- **Earth splash damage**: 1000 → 2000 → 4000 → 8000 → 16000...
- **Earth splash radius**: 1000 → 2000 → 4000 → 8000 → 16000...
- **Air burst shots**: 1000 → 2000 → 4000 → 8000 → 16000...
- **Air burst cooldown**: 1000 → 2000 → 4000 → 8000 → 16000...

_Note: Fire burn duration and Ice slow duration removed (useless upgrades)_

##### Removed Useless Upgrades

```typescript
// Remove these upgrades entirely (duration never matters)
fire_burn_duration_upgrade: REMOVED;
ice_slow_duration_upgrade: REMOVED;
```

##### Standardized Upgrade Costs

```typescript
// All remaining upgrades start at 1000 gold with 2x scaling
fire_burn_damage_upgrade: { cost: 1000, costScalingFactor: 2.0 }
ice_slow_effect_upgrade: { cost: 1000, costScalingFactor: 2.0 }
earth_splash_damage_upgrade: { cost: 1000, costScalingFactor: 2.0 }
earth_splash_radius_upgrade: { cost: 1000, costScalingFactor: 2.0 }
air_burst_shots_upgrade: { cost: 1000, costScalingFactor: 2.0 }
air_burst_cooldown_upgrade: { cost: 1000, costScalingFactor: 2.0 }
```

### 3. Increased Initial Gold Costs

#### Current Costs Analysis

- **Earth radius upgrade**: 500 gold (very strong for the cost)
- **Fire burn damage**: 1000 gold
- **Ice slow effect**: 1000 gold
- **Air burst shots**: 1000 gold

#### Proposed Cost Increases

```typescript
// Earth radius: Much more expensive (very strong ability)
earth_splash_radius_upgrade: {
  baseCost: 2500, // 5x increase
  costMultiplier: 3,
  maxLevel: 10
},

// Fire burn damage: Moderate increase
fire_burn_damage_upgrade: {
  baseCost: 2000, // 2x increase
  costMultiplier: 1.3,
  maxLevel: 10
},

// Ice slow effect: Moderate increase
ice_slow_effect_upgrade: {
  baseCost: 2000, // 2x increase
  costMultiplier: 1.3,
  maxLevel: 10
},

// Air burst shots: Moderate increase
air_burst_shots_upgrade: {
  baseCost: 2000, // 2x increase
  costMultiplier: 1.3,
  maxLevel: 10
}
```

## Implementation Plan

### Phase 1: XP Requirements (High Priority)

1. Update `getXPForNextLevel` function in `src/data/elements.ts`
2. Test XP progression with new formula
3. Verify level 30 takes significantly longer to reach

### Phase 2: Cost Scaling (Medium Priority)

1. Standardize all tower costs to 100 gold in `src/data/defenders.ts`
2. Update tower cost scaling in `src/data/defenders.ts` (1.25 → 2.0)
3. Remove useless upgrades (fire burn duration, ice slow duration) from `src/data/upgrades.ts`
4. Standardize all upgrade costs to 1000 gold in `src/data/upgrades.ts`
5. Update upgrade cost scaling in `src/data/upgrades.ts` (1.15/1.2 → 2.0)
6. Test cost progression and affordability

### Phase 4: Testing & Balance

1. Playtest progression speed
2. Adjust formulas if needed
3. Verify difficulty 50 takes ~1 hour to reach

## Expected Outcomes

- **Level 30 elements**: Should take 2-3 hours instead of 5 minutes
- **Tower costs**: All start at 100 gold, exponential scaling (2x each purchase) encourages trying one of each
- **Upgrade costs**: All start at 1000 gold, exponential scaling (2x each upgrade) makes upgrades expensive
- **Removed useless upgrades**: No more burn/slow duration upgrades (enemies keep getting hit)
- **Gold economy**: More constrained, requires strategic spending decisions
- **Overall game length**: 1-2 hours to reach difficulty 50

## Questions for Discussion

1. **XP scaling**: Is 1.5x exponential too aggressive? Should we try 1.3x or 1.4x?
2. **Gold scaling**: Which option (linear, exponential, step-based) feels best?
3. **Cost increases**: Are the proposed multipliers reasonable?
4. **Testing approach**: Should we implement one change at a time or all together?
