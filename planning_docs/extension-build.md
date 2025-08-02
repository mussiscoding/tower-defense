# Extension Build - Additional Features

This file tracks additional features and improvements that come up during development.

## Better code

- [ ] **Firing defender**: Currently for each arrow, firing defender is worked out on proximity, I think we should just pass it as an input on an arrow

## Visual & Animation Improvements

- [ ] **Castle death animation**: When the castle is destroyed, add a visual animation (cracked/broken castle appearance, explosion effect, etc.)
- [ ] **Enemy walking animations**: Add walking/movement animations for enemies instead of static sprites

## UI/UX Improvements

- [ ] **Move save data to settings**: Create a dedicated settings panel for save management
- [ ] **Even defender distribution**: Defenders are currently random on y, but should be in gaps instead
- [ ] **New player intro**: Show them upgrades & the difficulty slider

## Content Expansions

- [ ] **Add more enemy types**: Expand enemy variety with unique behaviors
- [ ] **Add sound effects and background music**: Audio enhancements
- [ ] **Implement achievements system**: Player progression tracking

## Element Ability Enhancements

- [ ] **Fire burn stacking upgrade**: Shop upgrade that allows fire arrows to stack burn damage instead of just refreshing duration

  - Cost: 1000 gold
  - Effect: Multiple fire arrows on same enemy add burn damage together
  - Visual: Show multiple burn damage numbers when stacking occurs

- [ ] **Fire mages only attack non-burning enemies**: Shop upgrade that makes fire defenders prioritize enemies without burn effects

  - Cost: 500 gold
  - Effect: Fire defenders skip enemies that already have burn damage applied
  - Benefit: Prevents wasted attacks on already-burning enemies, improves efficiency
  - Implementation: Modify `findNearestEnemy` to filter out burning enemies for fire defenders

- [ ] **Ice effect - permafrost**: After x attacks, freeze enemy in place for 1s

  - Requires ice level 10
  - Expensive
  - Cool frozen effect (thinking translucent ice block over the enemy)

- [ ] **Ability numbers in element stats tabs**
