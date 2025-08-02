# School Planning - Mage Mastery System

## Core Concept

A tower defense idle game where all defenders are mages of different elemental schools. Each school levels up as a collective unit, gaining experience and unlocking new abilities as the mages attack enemies.

## Mage Schools & Elements

### Available Schools

- **Fire School**: Burn effects
- **Ice School**: Slow effects
- **Earth School**: Splash damage
- **Air School**: Fast attacks

### Later school ideas to build

- **Lightning School**: Chain lightning
- **Dark School**: Critical hits - eventually, chance of instant death

### School Progression

- Each school starts at Level 1
- All mages of the same school contribute XP to their school
- Schools level up collectively, unlocking new abilities for all mages of that type
- Higher school levels = Better stats
- Maximum level: 99 (RuneScape style)

## Mastery Mechanics

### Experience System

- **Damage = XP gained**: Each point of damage dealt grants 1 XP to the school
- XP doesn't scale with enemy difficulty - having more mages and attacking faster will scale them
- This balances fast-attacking towers (Air) vs slow high-damage towers (Earth)
- Uses RuneScape experience curve for level progression

### Level Progression

- **Level 1-99**: Gradual base stat improvements only (damage, attack speed, range)
- **Shop-driven abilities**: All ability upgrades come from the shop system
- **Linear progression**: Each level improves core combat stats
- **RuneScape XP curve**: Exponential XP requirements for higher levels

### School Specialization Rewards

- **Fire Mastery**: Increased burn damage and duration (shop upgrades)
- **Ice Mastery**: Longer slow duration and stronger slow effects (shop upgrades)
- **Earth Mastery**: Larger splash radius and splash damage (shop upgrades)
- **Air Mastery**: Burst attack speed ability (shop upgrades for cooldown, buff strength, duration)
- **Lightning Mastery**: More chain targets and chain damage (future shop upgrades)
- **Dark Mastery**: Higher critical chance and critical damage (future shop upgrades)

## UI Design - The Academy

### Overview Tab

- Shows all schools with their current levels
- XP bars for each school with exact numbers
- Total academy level and overall progress
- Quick stats comparison between schools

### School-Specific Tabs

Each school has its own detailed tab showing:

- **Current Level**: Exact level and XP progress (1-99)
- **School Stats**: Damage, attack speed, range, special abilities
- **Progression Tree**: Visual representation of unlocked abilities
- **Next Unlocks**: What abilities are coming next
- **School History**: Total damage dealt, enemies killed, etc.

### Academy Features

- **School Comparison**: Side-by-side stats of different schools
- **Respec System**: Option to redistribute XP (with cost)
- **Mastery Points**: Earned at milestone levels for permanent upgrades
- **Achievements**: School-specific achievements and milestones

## Strategic Depth

### Early Game

- Players experiment with different schools
- Each school feels unique and viable
- No "wrong" choice - just different playstyles
- Focus on getting first few schools to Level 10

### Mid Game

- Players start specializing in 2-3 schools
- School levels create meaningful differences
- Some schools become better for certain enemy types
- Strategic decisions about which schools to prioritize

### Late Game

- High-level schools are dramatically more powerful
- Players can respec or focus on new specializations
- Mastery becomes a major progression driver
- Multiple high-level schools create powerful synergies

## Implementation Priority

### Phase 1: Core System

1. **Basic XP/Leveling** - Damage-based XP gain per attack
2. **School Levels** - Track levels for each school (1-99)
3. **Basic UI** - Academy overview with school tabs
4. **RuneScape XP Curve** - Implement exponential XP requirements

### Phase 2: Advanced Features

1. **Visual Feedback** - XP bars, level displays, level-up effects
2. **Ability Trees** - Simplified progression for each school
3. **Specialization** - Unique bonuses for each element

### Phase 3: Polish

1. **Achievements** - School-specific milestones
2. **Mastery Points** - Permanent progression system
3. **Advanced UI** - Detailed statistics and comparisons
4. **Balance Tuning** - Fine-tune progression speeds

## Why This Works for Idle Games

1. **Always Improving**: Every attack makes your schools stronger
2. **Multiple Progression Paths**: Players can specialize or diversify
3. **Satisfying Numbers**: XP, levels, and school stats all go up
4. **Strategic Depth**: Different schools for different situations
5. **Replayability**: Players can try different school combinations
6. **Grindy = Good**: Idle game players love grinding and progression!

## Potential Challenges

1. **Complexity**: Need to track XP for each school
2. **Balance**: High-level schools might become overpowered
3. **UI Complexity**: Need to display school info clearly
4. **New Player Experience**: Might be overwhelming at first

## Next Steps

1. Design the RuneScape XP curve for schools (1-99)
2. Create simplified ability trees for each school
3. Plan the Academy UI layout
4. Balance the progression speed
5. Design the respec system
