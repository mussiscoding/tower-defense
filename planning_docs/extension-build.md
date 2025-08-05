# Extension Build - Additional Features

This file tracks additional features and improvements for future development phases.

## 🎨 Visual & Graphics Improvements

### High Priority

- [ ] **Mage sprites**: Create proper sprite designs for all 4 element mages
- [x] **Enemy SVG sprites**: Replace current enemy sprites with proper SVG designs
- [ ] **Castle death animation**: When the castle is destroyed, add visual animation (cracked/broken castle appearance, explosion effect, etc.)
- [x] **Enemy walking animations**: Add walking/movement animations for enemies instead of static sprites

### Medium Priority

- [x] **Sprite-based element effects**: Replace square borders with sprite-shaped borders that follow actual enemy sprite shape

## 🎮 Gameplay Enhancements

### Core Mechanics

- [x] **Even defender distribution**: Defenders are currently random on y, but should be in gaps instead
- [ ] **Firing defender tracking**: Pass defender ID as input on arrows instead of calculating proximity
- [x] **Difficulty system**: Change to 1-99+ scale (numbers with up/down arrows) instead of two sliding scales

### Content Expansions

- [ ] **Add more enemy types**: Expand enemy variety with unique behaviors and abilities
- [ ] **Sound effects and background music**: Audio enhancements for better immersion
- [ ] **Achievements system**: Player progression tracking and milestones

## 🔥 Element Ability Enhancements

### Fire Upgrades

- [ ] **Fire burn stacking**: Shop upgrade that allows fire arrows to stack burn damage instead of just refreshing duration

  - Cost: 1000 gold
  - Effect: Multiple fire arrows on same enemy add burn damage together
  - Visual: Show multiple burn damage numbers when stacking occurs

- [ ] **Fire smart targeting**: Shop upgrade that makes fire defenders prioritize enemies without burn effects
  - Cost: 500 gold, Requires fire level 20
  - Effect: Fire defenders skip enemies that already have burn damage applied
  - Implementation: Modify `findNearestEnemy` to filter out burning enemies for fire defenders

### Ice Upgrades

- [ ] **Ice permafrost**: After x attacks, freeze enemy in place for 1s
  - Requires ice level 20, Expensive
  - Visual: Cool frozen effect (translucent ice block over the enemy)

### Earth Upgrades

- [ ] **Earth smart targeting**: Shop upgrade that makes earth towers target the highest density of enemies in range
  - Requires earth level 20, Expensive

### Air Upgrades

- [ ] **Air multi-target burst**: Air burst attacks multiple enemies instead of just one
  - Straight up double damage potential
- [ ] **Air smart burst targeting**: Burst arrows can target different enemies based on predicted damage
  - Allows burst to stop hitting one enemy when it would have died already

## 🛒 Shop & Progression Improvements

### UI Enhancements

- [ ] **Show all element details in elements tab**: Display comprehensive stats for each element
- [ ] **Ability numbers in element stats tabs**: Show exact numerical values for all abilities
- [ ] **New player intro**: Show them upgrades & the difficulty slider

### Progression Systems

- [ ] **Level-gated upgrades**: Some upgrades should require certain levels as well as gold
  - This allows for timing gatekeeping, player must have x time to get to y exp before scaling too far
  - Should apply to both basic and special abilities

### Settings & Management

- [ ] **Move save data to settings**: Create a dedicated settings panel for save management

## 🧹 Code Quality & Performance

### Technical Improvements

- [ ] **Performance optimization**: Optimize for larger numbers of enemies and defenders
- [ ] **Memory management**: Ensure smooth performance during long sessions
- [ ] **Code refactoring**: Clean up and optimize existing systems

## 📊 Analytics & Monitoring

### Player Insights

- [ ] **Detailed statistics**: Track player behavior and game balance metrics
- [ ] **Performance monitoring**: Monitor game performance and identify bottlenecks
- [ ] **Balance analytics**: Analyze element usage and effectiveness

## 🎯 Future Considerations

### Advanced Features

- [ ] **Prestige system**: Long-term progression mechanics
- [ ] **Element combinations**: Special effects when multiple elements work together
- [ ] **Dynamic difficulty**: Adaptive difficulty based on player performance
- [ ] **Seasonal content**: Limited-time events and special enemies

### Accessibility

- [ ] **Accessibility features**: Colorblind support, screen reader compatibility
- [ ] **Mobile optimization**: Touch controls and responsive design
- [ ] **Localization**: Multi-language support
