# Vibe Ideas - Mage Mastery System

## Core Concept

A tower defense idle game where all defenders are mages of different elemental schools. Each school levels up as a collective unit, gaining experience and unlocking new abilities as the mages attack enemies.

## Mage Schools & Elements

### Available Schools

- **Fire School**: Splash damage, burn effects, high damage
- **Ice School**: Slow effects, freeze chance, crowd control
- **Lightning School**: Fast attacks, chain lightning, critical hits
- **Dark School**: High damage, life steal, debuffs
- **Light School**: Healing, buffs, support abilities

### School Progression

- Each school starts at Level 1
- All mages of the same school contribute XP to their school
- Schools level up collectively, unlocking new abilities for all mages of that type
- Higher school levels = more powerful abilities and better stats

## Mastery Mechanics

### Experience System

- Each attack by any mage grants XP to their school
- XP gain scales with enemy difficulty and mage level
- Boss enemies grant bonus XP
- Special events (combo kills, perfect timing) grant bonus XP

### Level Progression

- **Level 1-10**: Basic abilities, gradual damage increase
- **Level 11-25**: Unlock secondary abilities (Fire gets burn DoT, Ice gets freeze chance)
- **Level 26-50**: Unlock ultimate abilities (Fire gets meteor storm, Ice gets blizzard)
- **Level 51+**: Mastery bonuses (increased range, reduced cooldowns, etc.)

### School Specialization Rewards

- **Fire Mastery**: Increased burn duration, splash radius, fire damage
- **Ice Mastery**: Longer freeze duration, area slow effects, ice damage
- **Lightning Mastery**: Chain lightning, faster attack speed, lightning damage
- **Dark Mastery**: Life steal, critical hit chance, dark damage
- **Light Mastery**: Healing allies, damage buffs, light damage

## UI Design - The Academy

### Overview Tab

- Shows all schools with their current levels
- XP bars for each school with exact numbers
- Total academy level and overall progress
- Quick stats comparison between schools

### School-Specific Tabs

Each school has its own detailed tab showing:

- **Current Level**: Exact level and XP progress
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

1. **Basic XP/Leveling** - Simple XP gain per attack
2. **School Levels** - Track levels for each school
3. **Basic UI** - Academy overview with school tabs
4. **Level Milestones** - Unlock new abilities at certain levels

### Phase 2: Advanced Features

1. **Visual Feedback** - XP bars, level displays, level-up effects
2. **Ability Trees** - Detailed progression for each school
3. **School Specialization** - Unique bonuses for each element
4. **Respec System** - Allow redistribution of school focus

### Phase 3: Polish

1. **Achievements** - School-specific milestones
2. **Mastery Points** - Permanent progression system
3. **Advanced UI** - Detailed statistics and comparisons
4. **Balance Tuning** - Fine-tune progression speeds

## Example Progression Path

### Fire School Journey

- **Level 1**: Basic fireball, 10 damage
- **Level 5**: Fireball gets splash damage
- **Level 10**: Unlock "Burn" DoT effect
- **Level 15**: Burn duration increases
- **Level 20**: Unlock "Meteor Strike" ultimate
- **Level 25**: Meteor Strike cooldown reduced
- **Level 30**: Fire mastery bonus: +50% burn damage
- **Level 50**: Master Fire School: All fire abilities enhanced

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

1. Design the XP/leveling curve for schools
2. Create ability trees for each school
3. Plan the Academy UI layout
4. Balance the progression speed
5. Design the respec system
