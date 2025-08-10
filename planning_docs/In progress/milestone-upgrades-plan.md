# Skills Implementation Plan

## 🎯 Overview

Skills are permanent, game-changing abilities that unlock at specific element levels. These provide long-term progression goals and dramatically alter gameplay strategies.

## 🚀 Implementation Task List

### 🏗️ **Foundation & Data Structure**

- [x] Create skills data structure and types
- [x] Define skill unlock/purchase system
- [x] Implement mage count limits (max = element level / 10 + 1)
- [x] Add upgrade state tracking to save system

### 🎨 **Shop & UI Integration**

- [x] Implement Skills UI: Row of 10 skill icons with color-coded states
- [x] Create skill icon states: purchaseable/insufficient gold/level locked/purchased
- [x] Implement skill hover popup with icon, name, level cost, gold cost, description
- [x] Integrate skills row above current shop content
- [x] Add visual distinction for skills vs regular upgrades
- [x] Create skill tooltips and descriptions

#### 🎯 **Skills UI Specification**

**Layout**: Skills appear in the Shop tab as a horizontal row of 10 skill icons positioned above the current shop content.

**Icon States & Colors**:

- **🟢 Purchaseable**: Skill can be purchased (player has required level AND gold)
- **🟡 Level Met**: Player has required level but insufficient gold
- **🔴 Level Locked**: Player hasn't reached the required level yet
- **⚪ Purchased**: Skill has been acquired (different visual treatment)

**Hover Interaction**:

- **Trigger**: Mouse hover over any skill icon
- **Content**: Popup showing:
  - Skill icon (larger version)
  - Skill name
  - Required level
  - Gold cost
  - Detailed description
  - Current state (available/locked/purchased)

**Integration**: Skills row sits above existing shop content, maintaining current shop functionality below.

### ⚔️ **Core Abilities Implementation**

**Basic Abilities**

- [x] Fire: Burn (Level 5) - Free skill implemented
- [x] Ice: Slow enemies (Level 5) - Free skill implemented
- [x] Earth: Splash (Level 5) - Free skill implemented
- [x] Air: Burst (Level 5) - Free skill implemented

**Damage Abilities:**

- [ ] Fire: Percentage Health Damage (Level 15)
- [ ] Ice: [TBD Ice Damage] (Level 35)
- [ ] Earth: Smart Targeting (Level 15)
- [ ] Air: Critical Hit Chance (Level 15)

**Utility Abilities:**

- [ ] Fire: Lightning Bolt - instant kill highest HP (Level 55)
- [ ] Ice: Permafrost - freeze on first hit (Level 15)
- [ ] Earth: Earthquake - map-wide damage (Level 55)
- [ ] Air: Smart Burst Targeting (Level 55)

**Support Abilities:**

- [ ] Fire: Burn Stacking (Level 35)
- [ ] Ice: Critical Vulnerability - crits on slowed enemies (Level 55)
- [ ] Earth: Stone Skin - castle defense (Level 35)
- [ ] Air: Double Attack Speed for neighbors (Level 35)

### 🔗 **Synergy Abilities Implementation**

**Fire + Ice: Freezeburn (Fire L25, Ice L25):**

- [ ] Implement frozen enemies take double burn damage

**Fire + Earth: Disco Inferno (Fire L65, Earth L55):**

- [ ] Implement burn spreads to nearby enemies on death

**Fire + Air: Firewave (Fire L45, Air L45):**

- [ ] Implement semi-circle of fire arrows

**Ice + Earth: Ice Spikes (Ice L45, Earth L45):**

- [ ] Implement ice circles on map that slow + damage

**Ice + Air: Icy Wind (Ice L65, Air L65):**

- [ ] Implement map-wide wind currents that slow all enemies

**Earth + Air: Vortex (Earth L25, Air L25):**

- [ ] Implement pulling enemies into tighter groups

### 🎁 **Bonus Abilities (Design + Implement)**

**Design Remaining Abilities:**

- [ ] Fire Bonus 1 (Level 75)
- [ ] Fire Bonus 2 (Level 85)
- [ ] Ice Bonus 1 (Level 75)
- [ ] Ice Bonus 2 (Level 85)
- [ ] Air Bonus 1 (Level 75)
- [ ] Air Bonus 2 (Level 85)

**Implement Earth Bonus Abilities:**

- [ ] Earth: Fissure - line damage AOE (Level 75)
- [ ] Earth: Fragment Explosion - earth fragments explode again (Level 85)

### 🎯 **Visual Effects & Polish**

- [ ] Create burn stacking visual effects
- [ ] Design lightning bolt visual effects
- [ ] Implement ice wall visual (Invoker-style)
- [ ] Create permafrost freeze visual effects
- [ ] Design firewave semi-circle visual
- [ ] Implement icy wind particle effects
- [ ] Create vortex pulling visual effects
- [ ] Design ice spikes visual effects
- [ ] Add upgrade acquisition celebration effects

### ⚖️ **Balance & Testing**

- [ ] Finalize gold costs for all upgrades
- [ ] Test mage count limits impact on gameplay
- [ ] Balance synergy power levels
- [ ] Test progression pacing (levels 5-85)
- [ ] Verify reciprocal synergies work correctly
- [ ] Adjust upgrade costs based on power level

### 📊 **Economy Integration**

- [ ] Verify gold costs fit current economy
- [ ] Test upgrade affordability at each level
- [ ] Balance cost vs power for each tier
- [ ] Ensure progression feels rewarding

### 🐛 **Quality Assurance**

- [ ] Test all upgrade unlock conditions
- [ ] Verify save/load preserves upgrade states
- [ ] Test synergy interactions don't break gameplay
- [ ] Ensure UI handles all upgrade states correctly
- [ ] Test edge cases (max level, multiple synergies active)

### 📖 **Documentation & Communication**

- [ ] Create player-facing upgrade descriptions
- [ ] Document upgrade mechanics for players
- [ ] Create implementation documentation
- [ ] Update game guides with new progression

## 🎯 **Priority Implementation Order**

1. **Foundation** - Data structure, mage limits, save system
2. **Shop Integration** - UI, visual design, unlock display
3. **Core Abilities** - Damage, utility, support (highest impact)
4. **Synergies** - Cross-element abilities (complex but high value)
5. **Bonus Abilities** - Design + implement ultimate abilities
6. **Visual Effects** - Polish and juice
7. **Balance & Testing** - Fine-tuning and bug fixes

## 🚨 NEW CORE MECHANIC: Mage Count Limits

**Formula**: Max mages per element = `(element level / 10) + 1`

**Progression**:

- Level 1-9: 1 mage max
- Level 10-19: 2 mages max
- Level 20-29: 3 mages max
- Level 30-39: 4 mages max
- Level 40-49: 5 mages max
- Level 50-59: 6 mages max
- Level 60-69: 7 mages max
- Level 70-79: 8 mages max
- Level 80-89: 9 mages max
- Level 90-99: 10 mages max

**Impact**: This fundamentally changes scaling! Instead of infinite mages, each element is limited, making:

- **Individual mage power more important** than quantity
- **Skills CRITICAL** for late-game viability
- **Element choice meaningful** - can't just spam one element
- **Balanced multi-element strategies** necessary for optimal play

## 🔑 Key Design Principles

1. **Visible from Start**: All skills shown in shop immediately to create aspirational goals
2. **Meaningful Progression**: Each skill significantly changes how that element plays
3. **Balanced Costs**: Gold costs scale with power and unlock level
4. **Visual Impact**: Clear visual feedback when skills are active
5. **Strategic Depth**: Create meaningful choices and synergies between elements
6. **Level 5 Rhythm**: Skills only unlock on levels ending in 5 (15, 25, 35, 45, 55, 65, 75, 85, 95)
   - **Level 10s**: New mage slot unlocked
   - **Level 5s**: New skill available
   - Creates perfect alternating progression rhythm
   - **9 total skills per element**: Base (5) + 7 Core (15-75) + 1 Bonus (85)

## 📋 Skills Framework

### 🎯 **Skill Categories (Each Element Gets One of Each):**

1. **Damage** - Pure damage scaling/enhancement
2. **Utility** - Special tactical abilities
3. **Support** - Buffs/helps other elements
4. **Synergy 1** - Dual element ability
5. **Synergy 2** - Dual element ability
6. **Synergy 3** - Dual element ability
7. **Bonus 1** - Additional powerful skill
8. **Bonus 2** - Additional powerful skill

This gives each element 8 skills (+ base ability at level 5) = 9 total per element

### 📊 **Reorganized Framework:**

#### 🔥 Fire Element Categories:

- **Level 5**: Base Ability (Burn)
- **Level 15**: 🎯 **DAMAGE** - Percentage Health Damage
- **Level 25**: 🧊 **ICE SYNERGY** - Fire + Ice: Freezeburn
- **Level 35**: 🤝 **SUPPORT** - Burn Stacking (better with multiple fire mages)
- **Level 45**: 💨 **AIR SYNERGY** - Fire + Air: Firewave (semi-circle of fire arrows)
- **Level 55**: ⚡ **UTILITY** - Lightning Bolt (instant kill highest HP)
- **Level 65**: 🌍 **EARTH SYNERGY** - Fire + Earth: Disco Inferno (burn spreads to nearby enemies on death)
- **Level 75**: ⭐ **BONUS 1** - [TBD - Fire Power Upgrade]
- **Level 85**: ⭐ **BONUS 2** - [TBD - Ultimate Fire Ability]

#### 🧊 Ice Element Categories:

- **Level 5**: Base Ability (Slow)
- **Level 15**: ⚡ **UTILITY** - Permafrost (freeze on first hit)
- **Level 25**: 🔥 **FIRE SYNERGY** - Ice + Fire: Freezeburn
- **Level 35**: 🎯 **DAMAGE** - [TBD]
- **Level 45**: 🌍 **EARTH SYNERGY** - Ice + Earth: Blizzard (ice circles on map that slow + damage)
- **Level 55**: 🤝 **SUPPORT** - [TBD]
- **Level 65**: 💨 **AIR SYNERGY** - Ice + Air: [TBD - needs design]
- **Level 75**: ⭐ **BONUS 1** - [TBD - Ice Power Upgrade]
- **Level 85**: ⭐ **BONUS 2** - [TBD - Ultimate Ice Ability]

#### 🌍 Earth Element Categories:

- **Level 5**: Base Ability (Splash)
- **Level 15**: 🎯 **DAMAGE** - Smart Targeting
- **Level 25**: 💨 **AIR SYNERGY** - Earth + Air: Vortex (pulls enemies into tighter groups)
- **Level 35**: 🤝 **SUPPORT** - Stone Skin (castle defense)
- **Level 45**: 🧊 **ICE SYNERGY** - Earth + Ice: Blizzard (ice circles on map that slow + damage)
- **Level 55**: ⚡ **UTILITY** - Earthquake (map-wide)
- **Level 65**: 🔥 **FIRE SYNERGY** - Earth + Fire: Disco Inferno (burn spreads to nearby enemies on death)
- **Level 75**: ⭐ **BONUS 1** - Fissure (line damage AOE)
- **Level 85**: ⭐ **BONUS 2** - Earth fragments explode again

#### 💨 Air Element Categories:

- **Level 5**: Base Ability (Burst)
- **Level 15**: 🎯 **DAMAGE** - Critical Hit Chance
- **Level 25**: 🌍 **EARTH SYNERGY** - Air + Earth: Vortex (pulls enemies into tighter groups)
- **Level 35**: 🤝 **SUPPORT** - Double Attack Speed (neighboring mages)
- **Level 45**: 🔥 **FIRE SYNERGY** - Air + Fire: Firewave (semi-circle of fire arrows)
- **Level 55**: ⚡ **UTILITY** - Smart Burst Targeting
- **Level 65**: 🧊 **ICE SYNERGY** - Air + Ice: [TBD - needs design]
- **Level 75**: ⭐ **BONUS 1** - [TBD - Air Power Upgrade]
- **Level 85**: ⭐ **BONUS 2** - [TBD - Ultimate Air Ability]

## 📋 Current Upgrade List

### 🔥 Fire Element (9 upgrades total)

#### Level 5: Fire Base Ability - BURN

- **Unlock Level**: 5
- **Cost**: Free (automatic)
- **Effect**: Fire arrows apply burn damage over time
- **Visual**: Flame effect on burning enemies

#### Level 15: Fire Damage - Percentage Health Damage

- **Unlock Level**: 15
- **Cost**: TBD (placeholder: 30,000 gold)
- **Effect**: Fire arrows do % enemy health damage on hit
- **Impact**: Scales with enemy health, remains relevant late game
- **Priority**: High

#### Level 25: Fire + Ice Synergy - Freezeburn

- **Unlock Level**: 25
- **Cost**: TBD (placeholder: 50,000 gold)
- **Effect**: Frozen enemies take double burn damage
- **Visual**: Blue-orange flame effect on frozen burning enemies
- **Priority**: Medium

#### Level 35: Fire Support - Burn Stacking

- **Unlock Level**: 35
- **Cost**: TBD (placeholder: 75,000 gold)
- **Effect**: Fire arrows stack burn damage instead of refreshing duration
- **Visual**: Multiple burn damage numbers, stacked flame effect
- **Priority**: High (addresses fire balance issues)

#### Level 45: Fire + Air Synergy - Firewave

- **Unlock Level**: 45
- **Cost**: TBD (placeholder: 100,000 gold)
- **Effect**: Sends out a semi-circle of fire arrows (like air burst but sideways)
- **Visual**: Fan-shaped wave of flaming arrows
- **Priority**: Medium

#### Level 55: Fire Utility - Lightning Bolt

- **Unlock Level**: 55
- **Cost**: TBD (placeholder: 250,000 gold)
- **Effect**: Lightning bolt kills the highest HP enemy on the map
- **Visual**: Dramatic lightning strike from sky
- **Impact**: Instant removal of biggest threat
- **Priority**: High

#### Level 65: Fire + Earth Synergy - Disco Inferno

- **Unlock Level**: 65
- **Cost**: TBD (placeholder: 500,000 gold)
- **Effect**: On death, burn spreads to nearby enemies
- **Visual**: Explosive burn spread effect with disco-style lighting
- **Priority**: Medium

#### Level 75: Fire Bonus 1 - [TBD]

- **Unlock Level**: 75
- **Cost**: TBD (placeholder: 1,000,000 gold)
- **Effect**: [TBD - Fire Power Upgrade]
- **Priority**: Low

#### Level 85: Fire Bonus 2 - [TBD]

- **Unlock Level**: 85
- **Cost**: TBD (placeholder: 2,000,000 gold)
- **Effect**: [TBD - Ultimate Fire Ability]
- **Priority**: Low

### 🧊 Ice Element (9 upgrades total)

#### Level 5: Ice Base Ability - SLOW

- **Unlock Level**: 5
- **Cost**: Free (automatic)
- **Effect**: Ice arrows slow enemy movement speed
- **Visual**: Frost effect on slowed enemies

#### Level 15: Ice Utility - Permafrost

- **Unlock Level**: 15
- **Cost**: TBD (placeholder: 30,000 gold)
- **Effect**: On first hit from ice tower, freeze enemy for 1s
- **Visual**: Translucent ice block effect
- **Priority**: Medium

#### Level 25: Ice + Fire Synergy - Freezeburn

- **Unlock Level**: 25
- **Cost**: TBD (placeholder: 50,000 gold)
- **Effect**: Frozen enemies take double burn damage
- **Visual**: Blue-orange flame effect on frozen burning enemies
- **Priority**: Medium

#### Level 35: Ice Wall

- **Effect**: Creates vertical wall across map middle, slows all enemies in wall
- **Visual**: Invoker-style ice wall
- **Priority**: Low (complex implementation)

#### Level 45: Ice + Earth Synergy - Ice spikes

- **Unlock Level**: 45
- **Cost**: TBD (placeholder: 100,000 gold)
- **Effect**: Ice circles appear on map that slow and damage enemies
- **Visual**: Ice spike effects in multiple locations
- **Priority**: Medium

#### Level 55: Ice Support - Critical Vulnerability

- **Unlock Level**: 55
- **Cost**: TBD (placeholder: 250,000 gold)
- **Effect**: Any hits on slowed enemies have increased crit chance / guaranteed crit
- **Visual**: Slowed enemies shimmer with vulnerability, critical hits have enhanced effects
- **Priority**: High

#### Level 65: Ice + Air Synergy - Icy Wind

- **Unlock Level**: 65
- **Cost**: TBD (placeholder: 500,000 gold)
- **Effect**: Creates wind currents that slow all enemies on the map
- **Visual**: Visible wind effects with ice particles swirling across the battlefield
- **Priority**: Medium

#### Level 75: Ice Bonus 1 - [TBD]

- **Unlock Level**: 75
- **Cost**: TBD (placeholder: 1,000,000 gold)
- **Effect**: [TBD - Ice Power Upgrade]
- **Priority**: Low

#### Level 85: Ice Bonus 2 - [TBD]

- **Unlock Level**: 85
- **Cost**: TBD (placeholder: 2,000,000 gold)
- **Effect**: [TBD - Ultimate Ice Ability]
- **Priority**: Low

### 🌍 Earth Element (9 upgrades total)

#### Level 5: Earth Base Ability - SPLASH

- **Unlock Level**: 5
- **Cost**: Free (automatic)
- **Effect**: Earth arrows create splash damage around impact point
- **Visual**: Explosion effect with debris

#### Level 15: Earth Damage - Smart Targeting

- **Unlock Level**: 15
- **Cost**: TBD (placeholder: 30,000 gold)
- **Effect**: Target highest enemy density for maximum splash
- **Implementation**: Modify targeting to consider splash potential
- **Priority**: High

#### Level 25: Earth + Air Synergy - Vortex

- **Unlock Level**: 25
- **Cost**: TBD (placeholder: 50,000 gold)
- **Effect**: Pulls enemies into tighter groups (for better earth splash damage)
- **Visual**: Swirling wind effects that draw enemies together
- **Priority**: Medium

#### Level 35: Earth Support - Stone Skin

- **Unlock Level**: 35
- **Cost**: TBD (placeholder: 75,000 gold)
- **Effect**: Reduces all incoming damage to castle
- **Visual**: Castle gains rocky armor appearance
- **Priority**: Medium

#### Level 45: Earth + Ice Synergy - Blizzard

- **Unlock Level**: 45
- **Cost**: TBD (placeholder: 100,000 gold)
- **Effect**: Ice circles appear on map that slow and damage enemies
- **Visual**: Swirling ice storm effects in multiple locations
- **Priority**: Medium

#### Level 55: Earth Utility - Earthquake

- **Unlock Level**: 55
- **Cost**: TBD (placeholder: 250,000 gold)
- **Effect**: Hit all enemies on the map
- **Visual**: Screen shake, ground cracks everywhere
- **Priority**: High

#### Level 65: Earth + Fire Synergy - Disco Inferno

- **Unlock Level**: 65
- **Cost**: TBD (placeholder: 500,000 gold)
- **Effect**: On death, burn spreads to nearby enemies
- **Visual**: Explosive burn spread effect with disco-style lighting
- **Priority**: Medium

#### Level 75: Earth Bonus 1 - Fissure

- **Unlock Level**: 75
- **Cost**: TBD (placeholder: 1,000,000 gold)
- **Effect**: Damage all enemies in a horizontal line in front of the mage
- **Visual**: Ground cracks and erupts in a line
- **Priority**: Low

#### Level 85: Earth Bonus 2 - Fragment Explosion

- **Unlock Level**: 85
- **Cost**: TBD (placeholder: 2,000,000 gold)
- **Effect**: Earth fragments explode again
- **Priority**: Low

### 💨 Air Element (9 upgrades total)

#### Level 5: Air Base Ability - BURST

- **Unlock Level**: 5
- **Cost**: Free (automatic)
- **Effect**: Air arrows fire in bursts of multiple shots
- **Visual**: Rapid-fire arrow animation

#### Level 15: Air Damage - Critical Hit Chance

- **Unlock Level**: 15
- **Cost**: TBD (placeholder: 30,000 gold)
- **Effect**: % Critical hit chance for massive damage
- **Visual**: Sparkling arrows, big damage number on hit
- **Priority**: High

#### Level 25: Air + Earth Synergy - Vortex

- **Unlock Level**: 25
- **Cost**: TBD (placeholder: 50,000 gold)
- **Effect**: Pulls enemies into tighter groups (for better earth splash damage)
- **Visual**: Swirling wind effects that draw enemies together
- **Priority**: Medium

#### Level 35: Air Support - Double Attack Speed

- **Unlock Level**: 35
- **Cost**: TBD (placeholder: 75,000 gold)
- **Effect**: Double the attack speed of neighbouring mages
- **Visual**: Wind effects around nearby mages
- **Priority**: Medium

#### Level 45: Air + Fire Synergy - Firewave

- **Unlock Level**: 45
- **Cost**: TBD (placeholder: 100,000 gold)
- **Effect**: Sends out a semi-circle of fire arrows (like air burst but sideways)
- **Visual**: Fan-shaped wave of flaming arrows
- **Priority**: Medium

#### Level 55: Air Utility - Smart Burst Targeting [may revisit this]

- **Unlock Level**: 55
- **Cost**: TBD (placeholder: 250,000 gold)
- **Effect**: Burst arrows can target different enemies based on predicted damage
- **Implementation**: Advanced targeting logic for burst shots
- **Priority**: Medium

#### Level 65: Air + Ice Synergy - Icy Wind

- **Unlock Level**: 65
- **Cost**: TBD (placeholder: 500,000 gold)
- **Effect**: Creates wind currents that slow all enemies on the map
- **Visual**: Visible wind effects with ice particles swirling across the battlefield
- **Priority**: Medium

#### Level 75: Air Bonus 1 - [TBD]

- **Unlock Level**: 75
- **Cost**: TBD (placeholder: 1,000,000 gold)
- **Effect**: [TBD - Air Power Upgrade]
- **Priority**: Low

#### Level 85: Air Bonus 2 - [TBD]

- **Unlock Level**: 85
- **Cost**: TBD (placeholder: 2,000,000 gold)
- **Effect**: [TBD - Ultimate Air Ability]
- **Priority**: Low

### 🔥❄️ Dual Element Synergy Upgrades

#### 🔥🧊 Fire + Ice: Freezeburn

- **Effect**: Frozen enemies take double burn damage
- **Visual**: Blue-orange flame effect on frozen burning enemies
- **Available to**: Fire (Level 55) and Ice (Level 45)

#### 🔥🌍 Fire + Earth: Disco Inferno

- **Effect**: On death, burn spreads to nearby enemies
- **Visual**: Explosive burn spread effect with disco-style lighting
- **Available to**: Fire (Level 75) and Earth (Level 45)

#### 🔥💨 Fire + Air: Firewave

- **Effect**: Sends out a semi-circle of fire arrows (like air burst but sideways)
- **Visual**: Fan-shaped wave of flaming arrows
- **Available to**: Fire (Level 65) and Air (Level 45)

#### 🧊🌍 Ice + Earth: Ice Spikes

- **Effect**: Ice circles appear on map that slow and damage enemies
- **Visual**: Ice spike effects in multiple locations
- **Available to**: Ice (Level 45) and Earth (Level 45)

#### 🧊💨 Ice + Air: Icy Wind

- **Effect**: Creates wind currents that slow all enemies on the map
- **Visual**: Visible wind effects with ice particles swirling across the battlefield
- **Available to**: Ice (Level 65) and Air (Level 65)

#### 🌍💨 Earth + Air: Vortex

- **Effect**: Pulls enemies into tighter groups (for better earth splash damage)
- **Visual**: Swirling wind effects that draw enemies together
- **Available to**: Earth (Level 65) and Air (Level 75)

## 🏪 Shop Integration - Skills UI

### New Skills UI Design

**Current**: Each element shop has ~3 regular upgrade items  
**With Skills**: Skills appear as a dedicated row of 10 icons above shop content

This provides clear visual separation between skills and regular upgrades.

### Skills Row Implementation

- **Dedicated skills row** - Horizontal row of 10 skill icons above current shop
- **Color-coded states** - Visual feedback for unlock/purchase status
- **Hover tooltips** - Detailed information on demand
- **Element context** - Skills shown are for the currently selected element

### Aspirational Display Strategy

- **Show all skills immediately** as icons in the skills row
- **Clear visual hierarchy** - Skills prominent at top, regular upgrades below
- **Compelling tooltips** - Make players excited to reach required levels
- **Progress feedback** - Color coding shows current accessibility

## 📊 Level & Cost Balance Framework

### Level Scaling Strategy

- **Early Game** (Levels 10-25): First major upgrade per element
- **Mid Game** (Levels 25-50): Core gameplay changes
- **Late Game** (Levels 50-75): Powerful, game-changing effects
- **End Game** (Levels 75-99): Ultimate abilities

### Cost Scaling Strategy

- **Tier 1** (Early, Lvl 15-20): 25,000-50,000 gold
- **Tier 2** (Mid, Lvl 35-40): 100,000-250,000 gold
- **Tier 3** (Late, Lvl 60-70): 500,000-1,000,000 gold
- **Tier 4** (End, Lvl 80-90): 2,000,000+ gold

## 📝 Brainstorm Task

**TODO**: Schedule brainstorming session to complete:

**✅ COMPLETED SYNERGIES:**

- 🔥🧊 Fire + Ice: Freezeburn
- 🔥🌍 Fire + Earth: Disco Inferno
- 🔥💨 Fire + Air: Firewave
- 🧊🌍 Ice + Earth: Ice Spikes
- 🧊💨 Ice + Air: Icy Wind
- 🌍💨 Earth + Air: Vortex

**🚧 STILL NEEDED:**

- **Fire**: Bonus 1 (Level 75) + Bonus 2 (Level 85)
- **Ice**: Bonus 1 (Level 75) + Bonus 2 (Level 85)
- **Earth**: All abilities defined ✅
- **Air**: Bonus 1 (Level 75) + Bonus 2 (Level 85)

**Total**: 6 upgrades still need design completion

**Priority Order**:

1. **Bonus upgrades** (Levels 75 & 85 for Fire, Ice, Air) - Ultimate abilities for late game

**Brainstorm Guidelines**:

- Each upgrade should feel unique and change gameplay
- Avoid simple stat boosts (damage +X)
- Consider synergies between elements
- Think about visual impact and player satisfaction
- Balance power with implementation complexity
