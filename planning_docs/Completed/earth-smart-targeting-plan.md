# Earth: Smart Targeting - Implementation Plan

## Overview

**Milestone Upgrade**: Earth: Smart Targeting  
**Level Requirement**: 15  
**Cost**: 30,000 gold  
**Priority**: High

## Current System Analysis

### How Targeting Currently Works

- **Current Logic**: `findNearestEnemy()` in `defender.ts` targets the enemy closest to the castle
- **Simple Priority**: Distance-based targeting (nearest = highest priority)
- **No Element-Specific Logic**: All defenders use the same targeting algorithm

### How Earth Splash Currently Works

- **Splash Damage**: Applied to all enemies within splash radius when arrow hits
- **Splash Radius**: Configurable (currently 50px base, upgradable)
- **Splash Damage**: Percentage of base damage (currently 20% base, upgradable)
- **Target Selection**: Random - splash hits whatever enemies happen to be nearby

## Problem Statement

Earth defenders are currently inefficient because they:

1. **Don't maximize splash potential** - They target the nearest enemy regardless of splash opportunities
2. **Waste splash damage** - Often hit single enemies or enemies with few nearby targets
3. **Miss strategic opportunities** - Don't consider enemy density when choosing targets

## Solution: Enemy Density Targeting

**Approach**: Modify Earth defender targeting to prioritize enemies surrounded by the most other enemies

**Benefits**:

- Maximizes splash damage output
- More strategic gameplay
- Clear visual feedback (players see Earth targeting groups)

**Implementation**:

1. Create `findBestEarthTarget()` function
2. Calculate "enemy density score" for each potential target
3. Score based on number of enemies within splash radius
4. Fall back to nearest enemy if no density differences

**Algorithm**:

```typescript
function calculateEnemyDensityScore(
  enemy: Enemy,
  allEnemies: Enemy[],
  splashRadius: number
): number {
  const nearbyEnemies = allEnemies.filter((other) => {
    if (other.id === enemy.id) return false;
    const distance = Math.sqrt(
      Math.pow(other.x - enemy.x, 2) + Math.pow(other.y - enemy.y, 2)
    );
    return distance <= splashRadius;
  });
  return nearbyEnemies.length;
}
```

## Implementation Plan

**This is the approach we want to implement.**

### Why This Option?

1. **Maximizes splash damage** - Earth will target enemies where splash can hit the most targets
2. **Strategic gameplay** - Players will see Earth making tactical decisions about targeting
3. **Clear visual feedback** - Earth will visibly target groups instead of single enemies
4. **Better balance** - Earth becomes more effective at crowd control, which fits its element theme
5. **Maintainable** - Easier to debug and balance than complex hybrid approaches

### Implementation Steps

#### Step 1: Create Earth-Specific Targeting Function ✅

- **File**: `src/utils/gameLogic/targeting.ts` (new module)
- **Function**: `findBestEarthTarget()`
- **Logic**: Calculate enemy density scores and return highest
- **Refactoring**: Moved all targeting logic to dedicated targeting module

#### Step 2: Modify Defender Update Logic ✅

- **File**: `src/utils/gameLogic/defender.ts`
- **Function**: `updateDefenders()`
- **Change**: Use Earth-specific targeting for Earth defenders
- **Implementation**: Conditional targeting based on defender type AND skill purchase
- **Skill Check**: Only activates if `earth_smart_targeting` skill is purchased

### Code Structure

```typescript
// New function in defender.ts
export const findBestEarthTarget = (
  defender: Defender,
  enemies: Enemy[],
  predictedArrowDamage: Map<string, number>,
  predictedBurnDamage: Map<string, number>,
  splashRadius: number
): Enemy | null => {
  // Get enemies in range (same as current logic)
  const enemiesInRange = getEnemiesInRange(
    defender,
    enemies,
    predictedArrowDamage,
    predictedBurnDamage
  );

  if (enemiesInRange.length === 0) return null;

  // Calculate density scores
  const enemiesWithScores = enemiesInRange.map((enemy) => ({
    enemy,
    densityScore: calculateEnemyDensityScore(enemy, enemies, splashRadius),
  }));

  // Find highest density target
  const bestTarget = enemiesWithScores.reduce((best, current) =>
    current.densityScore > best.densityScore ? current : best
  );

  return bestTarget.enemy;
};
```

## Testing Strategy

### Unit Tests

1. **Density Calculation**: Test with various enemy arrangements
2. **Target Selection**: Verify highest density target is chosen
3. **Edge Cases**: Single enemies, no nearby enemies, equal density

### Integration Tests

1. **Game Loop**: Verify Earth defenders use new targeting
2. **Splash Damage**: Confirm increased splash damage output
3. **Performance**: Ensure no significant performance impact

### Visual Tests

1. **Targeting Indicators**: Verify visual feedback works
2. **Splash Effects**: Confirm splash damage hits expected targets
3. **Player Experience**: Test feels more strategic and satisfying

## Balance Considerations

### Potential Issues

1. **Too Powerful**: Earth might become dominant if targeting is too effective
2. **Performance**: Density calculations on every frame could be expensive
3. **Player Confusion**: New targeting might be unclear to players

### Mitigation Strategies

1. **Configurable Thresholds**: Allow tuning of density requirements
2. **Performance Optimization**: Cache density calculations, limit update frequency
3. **Clear Visual Feedback**: Make targeting logic obvious to players

## Future Enhancements

### Phase 2: Advanced Targeting

1. **Predictive Targeting**: Consider enemy movement patterns
2. **Health-Aware Targeting**: Factor in enemy health for optimal splash
3. **Element Synergies**: Coordinate with other element abilities

### Phase 3: Player Control

1. **Targeting Modes**: Allow players to choose targeting strategy
2. **Manual Override**: Let players manually select targets
3. **Targeting Preferences**: Save player targeting preferences

## Success Metrics

### Quantitative

1. **Splash Damage Output**: 20-30% increase in total splash damage
2. **Target Efficiency**: 50%+ of Earth shots hit 2+ enemies
3. **Performance**: <5ms additional processing time per frame

### Qualitative

1. **Player Satisfaction**: Earth feels more strategic and powerful
2. **Visual Clarity**: Players understand why Earth targets certain enemies
3. **Game Balance**: Earth is competitive but not overpowered

## Implementation Priority

### High Priority (Week 1)

- [x] Implement basic density targeting
- [ ] Integrate with existing defender logic
- [ ] Basic testing and bug fixes

### Medium Priority (Week 2)

- [ ] Add visual feedback
- [ ] Performance optimization
- [ ] Balance tuning

### Low Priority (Week 3+)

- [ ] Advanced targeting features
- [ ] Player customization options
- [ ] Additional visual effects

## Conclusion

The Earth: Smart Targeting upgrade will significantly improve Earth defender effectiveness by making them target enemies where their splash damage can do the most good. The recommended enemy density targeting approach provides the best balance of effectiveness, simplicity, and player satisfaction.

This upgrade will make Earth defenders feel more strategic and powerful, encouraging players to invest in Earth upgrades and creating more engaging gameplay.
