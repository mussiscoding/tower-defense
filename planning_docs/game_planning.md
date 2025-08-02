# Tower Defense Idle Game Planning Document

## Game Overview

A browser-based idle/tower defense hybrid where players defend a castle from waves of enemies. Players manually click to damage enemies initially, then purchase automated defenders (archers, mages, trebuchets) who attack automatically. The goal is to balance enemy difficulty and spawn rates to maximize gold earnings while preventing castle destruction.

## Core Game Mechanics

### 1. Basic Clicking System

- **Primary Action**: Click on enemies to damage them
- **Visual Feedback**: Damage numbers, enemy health bars, satisfying hit effects
- **Click Damage**: Base damage per click (starts at 1-5 damage)
- **Enemy Targeting**: Click directly on enemies to attack them

### 2. Currency System

- **Primary Currency**: Gold (earned from killing enemies)
- **Secondary Currencies**: Experience points, prestige points, gems
- **Display**: Large, prominent counter with formatting (1K, 1M, 1B, etc.)
- **Gold Sources**: Enemy kills, wave completion bonuses, achievements

### 3. Upgrades & Purchases

- **Click Damage Upgrades**: Increase damage per click
- **Automated Defenders**: Archers, mages, trebuchets that attack automatically
- **Defender Upgrades**: Damage, attack speed, special abilities (piercing, splash, etc.)
- **Castle Upgrades**: Health, regeneration, defensive bonuses
- **Special Items**: Potions, scrolls, temporary buffs

### 4. Progression Systems

- **Infinite Spawning**: Continuous enemy generation with no waves
- **Defender Tiers**: Unlock new defender types at certain milestones
- **Prestige**: Reset for permanent bonuses (keep some upgrades)
- **Achievements**: Kill counts, efficiency goals, time survived
- **Difficulty Settings**: Player-controlled enemy spawn rate and strength
- **Castle Destruction**: When castle health reaches 0, player loses half their gold and all enemies are cleared (no gold reward)

## Technical Architecture

### Frontend Technologies

- **Framework**: React + TypeScript
- **Styling**: CSS/SCSS with modern design
- **Animations**: CSS animations or libraries like Framer Motion
- **State Management**: React Context API or Zustand for state management

### Backend Considerations

- **Data Persistence**: LocalStorage, IndexedDB, or server-side
- **Save System**: Auto-save and manual save options
- **Cloud Sync**: Optional account system for cross-device play

### Performance Considerations

- **Large Numbers**: Handle numbers beyond JavaScript's safe integer limit
- **Animation Performance**: Optimize for smooth 60fps gameplay
- **Memory Management**: Efficient state updates and cleanup

## Game Features

### Core Features (MVP)

1. **Combat System**

   - Clickable enemies with health bars
   - Damage numbers and visual feedback
   - Enemy movement from right to left
   - Castle health system

2. **Defender System**

   - Automated archers that target nearest enemies
   - Upgradeable damage and attack speed
   - Visual representation of defenders on castle walls

3. **Enemy Management**

   - Continuous enemy spawning system
   - Difficulty scaling over time
   - Player-controlled spawn rate and enemy strength

4. **Castle System**

   - Castle health management
   - Castle destruction mechanic (lose half gold, clear enemies)
   - Visual castle representation

5. **Shop System**

   - Defender purchases and upgrades
   - Click damage improvements
   - Castle fortifications

6. **Save System**

   - Auto-save every few seconds
   - Export/import save data
   - Reset functionality

### Advanced Features (Future)

1. **Advanced Defenders**

   - Mages (magic damage, area effects)
   - Trebuchets (high damage, slow fire rate)
   - Specialized units (healers, buffers, debuffers)

2. **Enemy Variety**

   - Different enemy types (fast, tanky, flying, etc.)
   - Boss enemies with special abilities
   - Enemy formations and patterns

3. **Castle Customization**

   - Multiple castle layouts
   - Defensive structures (walls, towers, moats)
   - Visual themes and skins

4. **Prestige System**

   - Reset mechanics with permanent bonuses
   - Prestige currency for special upgrades
   - Unlock new defender types

5. **Statistics & Analytics**

   - Damage dealt, enemies killed, efficiency metrics
   - Wave completion times
   - Optimal strategy tracking

## User Interface Design

### Layout Structure

- **Header**: Gold display, time survived, castle health, settings menu
- **Main Area**: Castle on left, battlefield in center, enemy spawn area on right
- **Sidebar**: Shop (defenders, upgrades), statistics, difficulty controls
- **Footer**: Version info, links

### Visual Design

- **Theme**: Charming, cartoonish tower defense (similar to Kingdom Rush style)
- **Art Style**: Hand-drawn, cartoonish with bold outlines and whimsical appearance
- **Color Palette**: Bright, appealing colors - forest greens, earthy browns, vibrant purples/yellows/reds for effects
- **Typography**: Clear, readable fonts with playful accents
- **Icons**: Simple, recognizable icons for defenders and upgrades

### Responsive Design

- **Desktop**: Full feature set with keyboard shortcuts
- **Responsive**: Adapts to different screen sizes
- **Touch Support**: Mouse and touch input support

## Game Balance

### Economy Design

- **Cost Scaling**: Exponential growth for defender upgrades
- **Income Balance**: Manual clicking vs. automated defenders
- **Risk/Reward**: Higher difficulty = more gold but higher risk
- **Prestige Timing**: When to introduce prestige mechanics

### Progression Pacing

- **Early Game**: Manual clicking, first archer purchase
- **Mid Game**: Multiple defender types, strategic positioning
- **Late Game**: Complex defender combinations, optimization strategies

## Development Phases

### Phase 1: Core Mechanics (MVP)

- [ ] Basic combat system (clickable enemies)
- [ ] Castle health and enemy movement
- [ ] Simple archer defender
- [ ] Basic shop system
- [ ] Save system
- [ ] Simple cartoonish art style

### Phase 2: Expansion

- [ ] Multiple defender types (mages, trebuchets)
- [ ] Continuous spawning system
- [ ] Difficulty controls
- [ ] Enhanced UI/UX
- [ ] Statistics tracking

### Phase 3: Polish

- [ ] Combat animations and effects
- [ ] Sound design (archer shots, enemy death, etc.)
- [ ] Performance optimization

### Phase 4: Advanced Features

- [ ] Prestige system
- [ ] Enemy variety and special enemies
- [ ] Castle customization
- [ ] Advanced statistics and analytics

## Technical Challenges to Consider

1. **Game Loop Management**

   - Smooth 60fps enemy movement and combat
   - Efficient collision detection
   - Optimized rendering for many entities

2. **Large Number Handling**

   - Use libraries like `decimal.js` or `bignumber.js`
   - Implement custom number formatting for damage/health

3. **Save Data Management**

   - Efficient serialization/deserialization
   - Version compatibility for updates
   - Data validation and recovery

4. **Performance Optimization**

   - Efficient state updates for many enemies/defenders
   - Debounced save operations
   - Optimized rendering cycles

5. **Cross-Platform Compatibility**

   - Browser compatibility testing
   - Mobile touch optimization
   - Different screen size handling

## Monetization Considerations (Optional)

- **Cosmetic Upgrades**: Visual themes, particle effects
- **Convenience Features**: Auto-clickers, bulk purchases
- **Premium Currency**: Gems for special upgrades
- **Ad Integration**: Optional rewarded ads

## Success Metrics

- **Player Retention**: Daily/weekly active users
- **Engagement**: Average session length
- **Progression**: Time to reach milestones
- **Satisfaction**: Player feedback and ratings

---

## Next Steps

1. Choose technology stack
2. Create basic project structure
3. Implement core combat mechanics (clickable enemies)
4. Design initial UI mockups
5. Set up development environment

Would you like to dive deeper into any of these areas or start implementing a specific part?
