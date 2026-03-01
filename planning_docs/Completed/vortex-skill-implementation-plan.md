# Vortex Skill Implementation Plan

## 🎯 Overview

**Skill**: Earth + Air Synergy - Vortex  
**Unlock Level**: 25  
**Cost**: 50,000 gold  
**Type**: Dual-element synergy ability

**Core Concept**: Creates a wind vortex effect that gradually pulls enemies closer together to maximize Earth splash damage potential.

## 🎯 VORTEX SKILL DESIGN PLAN

**Core Concept**: Earth + Air synergy that creates a vortex effect, pulling enemies closer together to maximize Earth splash damage potential.

**Targeting Strategy**:

- **Primary Target**: Enemy with highest density potential (most enemies within pull radius)
- **Secondary Consideration**: Distance from castle (prioritize enemies further from castle to give more time for Earth mages to capitalize)
- **Fallback**: Nearest enemy if no density targets available

**Vortex Mechanics**:

- **Pull Radius**: 120-150 pixels (configurable, should be larger than Earth splash radius)
- **Pull Strength**: 30-50% of distance toward vortex center (not instant teleport)
- **Duration**: 1-2 seconds of continuous pulling effect
- **Cooldown**: 10 seconds between vortex activations

**Pull Effect Details**:

- **Gradual Movement**: Enemies are pulled toward the vortex center over time, not instantly
- **Center Calculation**: Vortex center is the primary target's position
- **Enemy Selection**: All enemies within pull radius are affected
- **Movement Interruption**: Pull effect temporarily overrides normal enemy movement toward castle

**Visual Effects**:

- **Vortex Animation**: Swirling wind particles rotating around the target area - vortex svgs should be used
- **Pull Lines**: Subtle wind trails showing the direction enemies are being pulled

**Synergy Benefits**:

- **Earth Mages**: Enemies grouped tighter = more splash damage per shot
- **Air Mages**: Vortex creates tactical positioning opportunities
- **Team Strategy**: Encourages coordination between Earth and Air elements

## 🔧 VORTEX IMPLEMENTATION PLAN

**Phase 1: Core Data Structure & Types**

- [x] Add `vortexEffect` to Enemy type (similar to `slowEffect`)
- [x] Create `VortexData` interface for tracking active vortexes
- [x] Add vortex-related constants to `SKILL_BASE_VALUES`
- [x] Update skill effects index to export vortex functionality

**Phase 2: Vortex Logic Implementation**

- [x] Create `vortexOnAttack.ts` skill effect file
- [x] Implement `createVortex()` function that:
  - Finds optimal target (highest density + distance from castle)
  - Creates vortex data structure
  - Applies pull effect to all enemies in radius
- [x] Implement `updateVortexEffects()` function for continuous pulling
- [x] Add vortex targeting logic to existing targeting system

**Phase 3: Enemy Movement Integration**

- [x] Modify `moveEnemies()` function to handle vortex effects
- [x] Implement gradual pull calculation (30-50% of distance toward center)
- [x] Add vortex effect duration tracking
- [x] Ensure vortex doesn't interfere with slow effects

**Phase 4: Visual Effects**

- [x] Create `VortexEffect.tsx` component for swirling wind animation
- [x] Add pull line indicators showing direction
- [x] Implement enemy wind effect feedback

**Phase 5: Integration & Polish**

- [ ] Add vortex to Earth + Air skill unlock system
- [ ] Integrate with existing skill purchase/activation flow
- [ ] Add vortex cooldown management
- [ ] Test synergy with Earth splash damage
- [ ] Balance pull strength and duration

## 🏗️ Technical Implementation Details

**Vortex Data Structure**:

```typescript
interface VortexData {
  id: string;
  centerX: number;
  centerY: number;
  radius: number;
  pullStrength: number;
  startTime: number;
  duration: number;
  affectedEnemyIds: Set<string>;
}
```

**Enemy Vortex Effect**:

```typescript
interface Enemy {
  // ... existing properties
  vortexEffect?: {
    vortexId: string;
    pullDirectionX: number;
    pullDirectionY: number;
    pullStrength: number;
    endTime: number;
  };
}
```

**Key Functions to Implement**:

- `createVortex(defender, target, context)` - Creates new vortex
- `updateVortexEffects(enemies, vortexes, currentTime)` - Updates all active vortexes
- `findOptimalVortexTarget(defender, enemies)` - Smart targeting logic
- `calculateVortexPull(enemy, vortex)` - Calculates pull effect for specific enemy

**Integration Points**:

- Add to `src/data/skillEffects/index.ts`
- Update `src/utils/gameLogic/enemy.ts` for movement
- Modify `src/utils/gameLogic/targeting.ts` for targeting
- Create new component in `src/components/`
- Update skill unlock system in main game logic

## 📋 VORTEX SKILL SUMMARY

**What It Does**: Creates a wind vortex that gradually pulls enemies toward a central point, grouping them tighter for better Earth splash damage.

**Key Design Decisions**:
✅ **Targeting**: Highest density potential + distance from castle consideration  
✅ **Radius**: 120-150px (larger than Earth splash for strategic value)  
✅ **Pull Effect**: Gradual 30-50% movement toward center (not instant teleport)  
✅ **Duration**: 2-3 seconds of continuous pulling  
✅ **Cooldown**: 8-12 seconds between activations

**Strategic Value**:

- **Earth Mages**: Enemies grouped tighter = more splash damage per shot
- **Air Mages**: Creates tactical positioning opportunities
- **Team Coordination**: Encourages Earth + Air synergy play

**Implementation Complexity**: Medium - Requires new enemy movement system, visual effects, and smart targeting logic.

**Next Steps**: Start with Phase 1 (data structures) and work through implementation phases systematically.

## 🔍 Research & Analysis

**Existing Similar Systems**:

- Air Burst targeting (multiple arrow spread)
- Earth splash damage (area of effect)
- Ice slow effects (movement modification)

**Key Differences from Existing Skills**:

- First skill that modifies enemy movement patterns
- Requires continuous effect updates (not just on-hit)
- Complex targeting logic (density + distance consideration)
- Visual effects that persist over time

**Potential Challenges**:

- Enemy movement system modification
- Performance with multiple active vortexes
- Visual effect complexity
- Balance between pull strength and strategic value

**Success Metrics**:

- Earth splash damage increase when vortex is active
- Player satisfaction with strategic positioning
- Balanced cooldown timing
- Smooth visual feedback
