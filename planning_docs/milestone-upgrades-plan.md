# Milestone Upgrades Implementation Plan

## 🎯 Overview

Milestone upgrades are permanent, game-changing abilities that unlock at specific element levels. These provide long-term progression goals and dramatically alter gameplay strategies.

## 🔑 Key Design Principles

1. **Visible from Start**: All upgrades shown in shop immediately to create aspirational goals
2. **Meaningful Progression**: Each upgrade significantly changes how that element plays
3. **Balanced Costs**: Gold costs scale with power and unlock level
4. **Visual Impact**: Clear visual feedback when upgrades are active
5. **Strategic Depth**: Create meaningful choices and synergies between elements

## 📋 Current Upgrade List

### 🔥 Fire Element (4 upgrades planned)

#### 1. Fire Burn Stacking

- **Unlock Level**: TBD (placeholder: 15)
- **Cost**: TBD (placeholder: 1000 gold)
- **Effect**: Fire arrows stack burn damage instead of refreshing duration
- **Visual**: Multiple burn damage numbers, stacked flame effect
- **Priority**: High (addresses fire balance issues)

#### 2. Fire Smart Targeting

- **Unlock Level**: TBD (placeholder: 25)
- **Cost**: TBD (placeholder: 500 gold)
- **Effect**: Fire defenders prioritize enemies without burn effects
- **Implementation**: Modify `findNearestEnemy` to filter burning enemies
- **Priority**: Medium

#### 3. [BRAINSTORM NEEDED] Fire Upgrade 3

- **Ideas**:
  - Burn spreads to nearby enemies on death
  - Critical hits cause burn explosion
  - Burn damage increases over time

#### 4. [BRAINSTORM NEEDED] Fire Upgrade 4

- **Ideas**:
  - Phoenix mode: temporary massive attack speed boost
  - Inferno: area denial that burns enemies passing through
  - Molten arrows: burn through armor/shields

### 🧊 Ice Element (4 upgrades planned)

#### 1. Ice Permafrost

- **Unlock Level**: TBD (placeholder: 20)
- **Cost**: TBD (expensive)
- **Effect**: After X attacks, freeze enemy for 1s
- **Visual**: Translucent ice block effect
- **Priority**: Medium

#### 2. Ice Wall

- **Unlock Level**: TBD (placeholder: 30)
- **Cost**: TBD (very expensive)
- **Effect**: Creates vertical wall across map middle, slows all enemies in wall
- **Visual**: Invoker-style ice wall
- **Priority**: Low (complex implementation)

#### 3. [BRAINSTORM NEEDED] Ice Upgrade 3

- **Ideas**:
  - Shatter: frozen enemies take extra damage
  - Ice armor: slowed enemies take reduced damage but move even slower
  - Frost aura: passive slow field around ice defenders

#### 4. [BRAINSTORM NEEDED] Ice Upgrade 4

- **Ideas**:
  - Blizzard: temporary map-wide slow effect
  - Ice spikes: frozen ground damages enemies
  - Avalanche: chance for ice attacks to hit multiple enemies in a line

### 🌍 Earth Element (4 upgrades planned)

#### 1. Earth Smart Targeting

- **Unlock Level**: TBD (placeholder: 20)
- **Cost**: TBD (expensive)
- **Effect**: Target highest enemy density for maximum splash
- **Implementation**: Modify targeting to consider splash potential
- **Priority**: High

#### 2. [BRAINSTORM NEEDED] Earth Upgrade 2

- **Ideas**:
  - Earthquake: periodic map-wide damage
  - Fortification: defenders gain armor/shields
  - Boulder: single massive damage shot with long cooldown

#### 3. [BRAINSTORM NEEDED] Earth Upgrade 3

- **Ideas**:
  - Piercing shots: arrows go through multiple enemies
  - Tremor: splash effects also slow enemies
  - Stone skin: reduces all incoming damage to castle

#### 4. [BRAINSTORM NEEDED] Earth Upgrade 4

- **Ideas**:
  - Meteor: devastating long-range bombardment
  - Landslide: creates temporary barriers
  - Crystal growth: splash areas persist and damage over time

### 💨 Air Element (4 upgrades planned)

#### 1. Air Multi-Target Burst

- **Unlock Level**: TBD (placeholder: 15)
- **Cost**: TBD
- **Effect**: Burst attacks hit multiple enemies instead of one
- **Impact**: Potentially doubles damage output
- **Priority**: High

#### 2. Air Smart Burst Targeting

- **Unlock Level**: TBD (placeholder: 25)
- **Cost**: TBD
- **Effect**: Burst arrows can target different enemies based on predicted damage
- **Implementation**: Advanced targeting logic for burst shots
- **Priority**: Medium

#### 3. [BRAINSTORM NEEDED] Air Upgrade 3

- **Ideas**:
  - Whirlwind: pulls enemies together for better splash
  - Lightning chain: attacks jump between enemies
  - Updraft: temporarily stops enemy movement

#### 4. [BRAINSTORM NEEDED] Air Upgrade 4

- **Ideas**:
  - Storm: rapid-fire mode with reduced damage
  - Tornado: creates moving damage zone
  - Wind barrier: deflects some enemy projectiles

## 🏪 Shop Integration Challenges & Solutions

### Problem: Long List Overwhelming

**Current**: Linear list becomes unwieldy with 16+ upgrades

**Proposed Solutions**:

1. **Tabbed Interface**: Separate tab for each element
2. **Accordion Sections**: Collapsible sections per element
3. **Grid Layout**: 4x4 grid with element icons
4. **Progressive Disclosure**: Show only next available upgrade per element
5. **Dedicated Upgrades Panel**: Separate from regular shop items

### Problem: Aspirational vs Clutter

**Goal**: Show upgrades for motivation without overwhelming new players

**Proposed Solutions**:

1. **Grayed Out State**: Show locked upgrades but clearly disabled
2. **Progress Indicators**: Show "Level 5/20" progress toward unlock
3. **Preview Mode**: Click to see what upgrade does before unlocking
4. **Milestone Badges**: Visual indicators of major progression points

## 📊 Level & Cost Balance Framework

### Level Scaling Strategy

- **Early Game** (Levels 10-20): First major upgrade per element
- **Mid Game** (Levels 20-35): Core gameplay changes
- **Late Game** (Levels 35-50): Powerful, game-changing effects
- **End Game** (Levels 50+): Ultimate abilities

### Cost Scaling Strategy

- **Tier 1** (Early): 500-2000 gold
- **Tier 2** (Mid): 2000-8000 gold
- **Tier 3** (Late): 8000-20000 gold
- **Tier 4** (End): 20000+ gold

### Unlock Level Calculation

```
Suggested Formula:
- Upgrade 1: Element Level 10-15
- Upgrade 2: Element Level 20-25
- Upgrade 3: Element Level 30-40
- Upgrade 4: Element Level 45-60
```

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1)

- [ ] Design shop UI layout for milestone upgrades
- [ ] Create upgrade data structure and types
- [ ] Implement basic unlock/purchase system
- [ ] Add visual indicators for locked/unlocked states

### Phase 2: Core Upgrades (Week 2)

- [ ] Implement Fire Burn Stacking
- [ ] Implement Air Multi-Target Burst
- [ ] Implement Earth Smart Targeting
- [ ] Add visual effects for active upgrades

### Phase 3: Expansion (Week 3)

- [ ] Complete brainstorming session for remaining upgrades
- [ ] Implement second tier upgrades for each element
- [ ] Add upgrade tooltips and descriptions
- [ ] Balance testing and cost adjustment

### Phase 4: Polish (Week 4)

- [ ] Implement remaining upgrades
- [ ] Final balance pass
- [ ] Add upgrade acquisition celebrations
- [ ] Documentation and player guides

## 🧠 Next Actions

### Immediate (This Week)

1. **Brainstorm Session**: Complete the missing upgrade ideas
2. **Level Balance**: Determine appropriate unlock levels
3. **UI Design**: Decide on shop layout approach
4. **Priority Order**: Which upgrades to implement first

### Research Questions

1. What's the typical level progression speed?
2. What's the current gold economy like at different stages?
3. Which elements feel underpowered and need priority upgrades?
4. How complex should the most advanced upgrades be?

## 📝 Brainstorm Task

**TODO**: Schedule brainstorming session to complete:

- 2 more Fire upgrades
- 2 more Ice upgrades
- 3 more Earth upgrades
- 2 more Air upgrades

**Brainstorm Guidelines**:

- Each upgrade should feel unique and change gameplay
- Avoid simple stat boosts (damage +X)
- Consider synergies between elements
- Think about visual impact and player satisfaction
- Balance power with implementation complexity

---

## 📋 Decision Log

_Track major decisions made during implementation_

| Date | Decision              | Reasoning |
| ---- | --------------------- | --------- |
| TBD  | Shop Layout Choice    | TBD       |
| TBD  | Level Scaling Formula | TBD       |
| TBD  | Implementation Order  | TBD       |
