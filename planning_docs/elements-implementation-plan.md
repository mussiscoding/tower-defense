# Implementation Plan - Mage Mastery System

## Phase 1: Core System Foundation

### 1.1 Data Structure Updates

**Priority: High**

- [x] Update `GameState.ts` to include element data
  - Add `elements: Record<ElementType, ElementData>` to GameState
  - Create `ElementData` interface with level, XP, and stats
  - Add element XP tracking to existing game state
- [x] Create `elements.ts` data file
  - Define all 4 elements with their base stats
  - Set up RuneScape XP curve for levels 1-99
  - Define element abilities and progression

### 1.2 XP System Implementation

**Priority: High**

- [x] Modify `gameLogic.ts` to grant XP on damage
  - Update `processArrowImpacts` function to grant element XP
  - Implement damage = XP formula (1 damage = 1 XP)
  - Add XP tracking per element in game state
- [x] Create XP calculation utilities
  - RuneScape XP curve function
  - Level calculation from XP
  - XP required for next level

### 1.3 Element Level Progression

**Priority: High**

- [x] Implement element leveling system
  - Check for level ups when XP is gained
  - Apply stat improvements based on level
- [x] Create element stat calculation
  - Base stats + level bonuses
  - Element-specific ability scaling
  - Damage/attack speed/range calculations

### 1.4 Basic Mages UI

**Priority: Medium**

- [x] Create `Mages.tsx` component
  - Box per element type with colored icon
  - Element name and level display
  - XP bar with hover tooltip showing current XP and next level requirement
  - Click to open individual element tab
- [x] Create individual element tabs
  - Detailed element stats display
  - Purchase button for mages of that element type
  - Element-specific information and abilities
- [x] Update `GameSidebar.tsx`
  - Add Mages tab to sidebar
  - Integrate with existing shop system
  - Maintain current UI patterns

### 1.5 Element Visuals

**Priority: High**

- [x] Element-specific defender sprites (colored boxes)
  - Fire Mage: Red box
  - Ice Mage: Blue box
  - Earth Mage: Brown box
  - Air Mage: White box
- [x] Element-specific projectiles
  - Fire: 🔥 fireball
  - Ice: ❄️ ice shard
  - Earth: 🪨 rock
  - Air: 💨 wind blast
- [x] Update Arrow component
  - Dynamic projectile based on defender type
  - Element-specific projectile styling
  - Element-themed trail effects

## Phase 2: Element Abilities & Progression

### 2.1 Element-Specific Abilities

**Priority: High**

- [x] Implement Fire element abilities
  - Burn damage system (shop-driven)
  - Burn duration system (shop-driven)
  - Visual burn effects
    - Burn damage numbers: Floating orange/red damage numbers every 500ms when burn ticks
    - Particle effects: Small fire particles/sparks floating up from burning enemies (consistent effect)
- [x] Implement Ice element abilities
  - Enemy state: Add slowEffect (percentage) and slowEndTime to Enemy interface
  - Movement calculation: Modify moveEnemies to apply slow multiplier: speed \* (1 - slowEffect/100)
  - Visual feedback: Blue border around enemy sprite when slowEffect > 0
  - Shop upgrades:
    - "Slow Effect +1%" (cost: 200 gold)
    - "Slow Duration +1s" (cost: 300 gold)
- [ ] Implement Earth element abilities
  - Splash damage system (shop-driven)
  - Splash radius system (shop-driven)
  - Visual splash effects
- [ ] Implement Air element abilities
  - Burst attack speed system (shop-driven)
  - Cooldown, buff strength, and duration upgrades
  - Visual burst effects

### 2.2 Shop System for Ability Upgrades

**Priority: High**

- [ ] Create ability upgrade shop items
  - Fire: "Burn Damage +1", "Burn Duration +1"
  - Ice: "Slow Effect +0.2", "Slow Duration +1"
  - Earth: "Splash Damage +2", "Splash Radius +5"
  - Air: "Burst Attack Speed +0.5", "Burst Duration +0.5", "Burst Cooldown -1"
- [ ] Implement shop purchase system
  - Track ability upgrades per element
  - Apply upgrades to element abilities
  - Update shop prices based on purchases
- [ ] Create shop UI for ability upgrades
  - Element-specific shop tabs
  - Current ability levels display
  - Upgrade cost and effect preview

### 2.3 Advanced Elements (Future)

**Priority: Low**

- [ ] Lightning element implementation
  - Chain lightning system
  - Chain target scaling
- [ ] Dark element implementation
  - Critical hit system
  - Critical chance scaling

### 2.3 Element Progression Display

**Priority: Medium**

- [ ] Create visual progression display
  - Level milestone displays
  - Ability improvement indicators
  - Next level previews
- [ ] Implement element-specific UI
  - Individual element tabs
  - Detailed stat displays
  - Progression history

## Phase 3: UI Polish & Advanced Features

### 3.1 Mages UI Enhancement

**Priority: Medium**

- [ ] Detailed element tabs
  - Current level and XP progress
  - Element stats breakdown
  - Progression visualization
  - Next level information
    - Performance metrics

### 3.2 Visual Feedback

**Priority: Medium**

- [ ] XP gain animations
  - XP bar filling animations
  - Level-up celebrations
  - Element-specific effects
- [ ] Level-up animations
  - Visual feedback when elements level up
  - Element-specific celebration effects
  - Notification system for level-ups
- [ ] Mages visual design
  - Consistent with game theme
  - Element-specific colors/themes
  - Professional UI polish

### 3.3 Advanced Features

**Priority: Low**

- [ ] Mage selling system
  - Sell mages for 50% of original cost
  - Decrease price of next mage (cost scaling based on owned count)
  - Confirmation dialogs
  - Refund gold to player
- [ ] Mastery points system
  - Milestone rewards
  - Permanent upgrades
  - Point allocation UI

## Phase 4: Balance & Polish

### 4.1 Game Balance

**Priority: High**

- [ ] Element balance testing
  - XP gain rate balance
  - Damage output balance
  - Element effectiveness comparison
- [ ] Progression speed tuning
  - RuneScape XP curve validation
  - Level-up frequency testing
  - End-game progression planning

### 4.2 Performance Optimization

**Priority: Medium**

- [ ] XP calculation optimization
  - Efficient XP tracking
  - Minimal state updates
  - Smooth animations
- [ ] Memory management
  - Element data storage
  - Historical data cleanup
  - Efficient rendering

### 4.3 User Experience

**Priority: Medium**

- [ ] New player experience
  - Tutorial for element system
  - Clear progression explanation
  - Helpful tooltips
- [ ] Accessibility features
  - Keyboard navigation
  - Screen reader support
  - Color contrast compliance

## Technical Implementation Details

### Data Structures

```typescript
interface ElementData {
  level: number;
  xp: number;
  totalDamage: number;
  baseStats: ElementBaseStats;
  abilities: ElementAbilities;
}

interface ElementBaseStats {
  damage: number;
  attackSpeed: number;
  range: number;
}

interface ElementAbilities {
  fire?: { burnDamage: number; burnDuration: number };
  ice?: { slowEffect: number; slowDuration: number };
  earth?: { splashDamage: number; splashRadius: number };
  air?: { attackSpeed: number; cooldown: number };
}
```

### XP Curve (RuneScape Style)

```typescript
const getXPForLevel = (level: number): number => {
  return Math.floor((level ** 3 - level) / 3);
};

const getLevelFromXP = (xp: number): number => {
  // Inverse calculation for level from XP
};
```

### Element Definitions

```typescript
const ELEMENTS = {
  fire: {
    name: "Fire",
    baseStats: { damage: 10, attackSpeed: 1.0, range: 100 },
    abilities: { burnDamage: 1, burnDuration: 3 },
  },
  ice: {
    name: "Ice",
    baseStats: { damage: 8, attackSpeed: 1.0, range: 100 },
    abilities: { slowEffect: 0.5, slowDuration: 2 },
  },
  earth: {
    name: "Earth",
    baseStats: { damage: 15, attackSpeed: 0.8, range: 80 },
    abilities: { splashDamage: 5, splashRadius: 30 },
  },
  air: {
    name: "Air",
    baseStats: { damage: 5, attackSpeed: 1.5, range: 120 },
    abilities: { attackSpeed: 1.5, cooldown: 0.5 },
  },
  // Future elements...
};
```

## Development Timeline

### Week 1: Foundation

- Data structure updates
- Basic XP system
- Element leveling mechanics

### Week 2: Core Abilities

- Fire element implementation
- Ice element implementation
- Basic Mages UI

### Week 3: UI & Polish

- Earth and Air elements
- Mages UI enhancement
- Visual feedback

### Week 4: Balance & Testing

- Game balance testing
- Performance optimization
- User experience polish

## Success Metrics

- [ ] All 4 core elements functional
- [ ] XP system working correctly
- [ ] Mages UI intuitive and informative
- [ ] Element progression feels satisfying
- [ ] Game balance maintains engagement
- [ ] Performance remains smooth

## Risk Mitigation

- **Complexity Risk**: Start with simple XP system, add complexity gradually
- **Balance Risk**: Extensive testing with different element combinations
- **Performance Risk**: Monitor XP calculations and optimize as needed
- **UI Risk**: User testing of Mages interface early and often
