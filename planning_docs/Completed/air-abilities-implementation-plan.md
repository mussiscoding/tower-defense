# Air Element Abilities Implementation Plan

## Overview

Air element will have **multi-shot burst** abilities - firing multiple arrows simultaneously when off cooldown. This fits the "wind/air" theme of being unpredictable and delivering sudden bursts of damage.

## Phase 1: Core Ability Design

### 1.1 Multi-Shot Burst Mechanics

**Concept**: Air towers can fire multiple arrows simultaneously when their burst ability is off cooldown.

**Base Stats**:

- **Burst Shots**: 3 arrows fired simultaneously
- **Burst Cooldown**: 8 seconds (time between burst activations)

**How it works**:

1. Air tower attacks normally at base attack speed
2. When burst is off cooldown and tower attacks, it fires multiple arrows at once
3. All burst arrows target the same enemy
4. Burst goes on cooldown after use
5. Tower returns to normal single-shot attacks until cooldown ends

### 1.2 Implementation Strategy

**Data Structure Updates**:

```typescript
// Add to ElementAbilities interface
interface ElementAbilities {
  // ... existing abilities
  burstShots?: number; // Number of arrows fired in burst (e.g., 3 = 3 arrows)
  burstCooldown?: number; // Cooldown between bursts in seconds
}

// Add to Defender interface
interface Defender {
  // ... existing properties
  burstCooldownEnd?: number; // When burst cooldown ends
}
```

## Phase 2: Core Implementation

### 2.1 Data Structure Updates

**Files to modify**:

- `src/types/GameState.ts` - Add burst properties to Defender interface
- `src/data/elements.ts` - Update Air base abilities
- `src/data/upgrades.ts` - Add Air burst upgrades

### 2.2 Burst Logic Implementation

**Files to modify**:

- `src/utils/gameLogic/defender.ts` - Add burst attack logic
- `src/utils/gameLogic/arrow.ts` - Handle burst arrow creation

**Key Functions**:

```typescript
// In defender.ts
const canDefenderBurst = (defender: Defender, currentTime: number): boolean => {
  return (
    !defender.burstActive &&
    defender.burstCooldownEnd &&
    currentTime >= defender.burstCooldownEnd
  );
};

const shouldStartBurst = (defender: Defender, currentTime: number): boolean => {
  // Start burst when it's available and defender is attacking
  return (
    canDefenderBurst(defender, currentTime) &&
    canDefenderAttack(defender, currentTime)
  );
};

const updateDefenderBurst = (
  defender: Defender,
  currentTime: number
): Defender => {
  // Check if burst should end
  if (defender.burstActive && defender.burstStartTime) {
    const burstDuration = getBurstDuration(defender.type);
    if (currentTime - defender.burstStartTime >= burstDuration * 1000) {
      return {
        ...defender,
        burstActive: false,
        burstStartTime: undefined,
        burstCooldownEnd: currentTime + getBurstCooldown(defender.type) * 1000,
      };
    }
  }

  // Check if burst should start
  if (shouldStartBurst(defender, currentTime)) {
    return {
      ...defender,
      burstActive: true,
      burstStartTime: currentTime,
      lastAttack: currentTime,
    };
  }

  return defender;
};
```

## Phase 3: Upgrade System

### 3.1 Burst Upgrades

**Upgrade Types**:

1. **Burst Shots** - Increase number of arrows fired in burst
2. **Burst Cooldown** - Reduce time between bursts

**Upgrade Scaling**:

- **Burst Shots**: +1 per upgrade (3 → 4 → 5, etc.)
- **Burst Cooldown**: -1s per upgrade (8s → 7s → 6s, etc.)

### 3.2 Upgrade Implementation

**Files to modify**:

- `src/data/upgrades.ts` - Add Air burst upgrades
- `src/data/elements.ts` - Update calculateElementAbilities for Air

## Phase 4: UI Updates

### 4.1 Stats Display

**Stats to show**:

- Show current burst shots count
- Show burst cooldown time
- Show burst status (ready/cooldown)

## Technical Implementation Details

### Data Flow

1. **Defender Update**: Check burst status and timing
2. **Attack Speed Calculation**: Apply burst multiplier if active
3. **Arrow Creation**: Create arrows at burst speed
4. **Visual Update**: Update tower appearance based on burst state
5. **UI Update**: Update stats display with burst information

### Key Considerations

- **Performance**: Burst mode creates many arrows quickly
- **Visual Clarity**: Players need to understand burst state
- **Balance**: Burst should be powerful but not game-breaking
- **Timing**: Burst activation should feel responsive

### Integration Points

- **Defender System**: Burst logic in defender update
- **Arrow System**: Burst arrows created at higher frequency
- **UI System**: Burst stats and status display
- **Upgrade System**: Burst ability upgrades
- **Visual System**: Burst visual effects

## Success Criteria

- [x] Air towers can enter burst mode
- [x] Burst mode increases attack speed significantly
- [x] Burst has proper duration and cooldown
- [x] Burst upgrades work correctly
- [x] Burst visual feedback is clear
- [x] Burst is balanced and fun to use
- [x] Burst integrates well with other elements
