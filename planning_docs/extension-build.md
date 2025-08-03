# Extension Build - Additional Features

This file tracks additional features and improvements that come up during development.

## Better code

- [ ] **Firing defender**: Currently for each arrow, firing defender is worked out on proximity, I think we should just pass it as an input on an arrow

## Visual & Animation Improvements

- [ ] **Castle death animation**: When the castle is destroyed, add a visual animation (cracked/broken castle appearance, explosion effect, etc.)
- [ ] **Enemy walking animations**: Add walking/movement animations for enemies instead of static sprites
- [ ] **Sprite-based element effects**: Replace square borders with sprite-shaped borders that follow the actual enemy sprite shape for better visual integration

## UI/UX Improvements

- [ ] **Move save data to settings**: Create a dedicated settings panel for save management
- [] **Show all element details in elements tab**
- [ ] **Even defender distribution**: Defenders are currently random on y, but should be in gaps instead
- [ ] **New player intro**: Show them upgrades & the difficulty slider

## Content Expansions

- [ ] **Add more enemy types**: Expand enemy variety with unique behaviors
- [ ] **Difficulty**: I think difficulty should be a 1-99+ scale (numbers with up down arrows) only, not two different sliding scales
- [ ] **Add sound effects and background music**: Audio enhancements
- [ ] **Implement achievements system**: Player progression tracking

## Element Ability Enhancements

- [ ] **Fire burn stacking upgrade**: Shop upgrade that allows fire arrows to stack burn damage instead of just refreshing duration

  - Cost: 1000 gold
  - Effect: Multiple fire arrows on same enemy add burn damage together
  - Visual: Show multiple burn damage numbers when stacking occurs

- [ ] **Fire mages only attack non-burning enemies**: Shop upgrade that makes fire defenders prioritize enemies without burn effects

  - Cost: 500 gold
  - Requires fire level 20
  - Effect: Fire defenders skip enemies that already have burn damage applied
  - Benefit: Prevents wasted attacks on already-burning enemies, improves efficiency
  - Implementation: Modify `findNearestEnemy` to filter out burning enemies for fire defenders

- [ ] **Ice effect - permafrost**: After x attacks, freeze enemy in place for 1s

  - Requires ice level 20
  - Expensive
  - Cool frozen effect (thinking translucent ice block over the enemy)

- [ ] **Ability numbers in element stats tabs**

- [ ] **Earth targeting**: Shop upgrade that makes earth towers target the highest density of enemies in range

  - Requires earth level 20
  - Expensive

- [ ] **Air multimultishot**: Air burst attacks two enemmies
  - Straight up double damage
- [ ] **Air multitargetmultishot**: INitially air burst only targets one enemy with all shots. This would allow it to take in predicted damage and stop hitting one enemy when it would have died already.

## Shopping

- [ ] **Upgrades based on level**: Some upgrades should require certain levels as well as gold

  - This should be for both basic and special abilities
  - This allows for certain timing gatekeeping, the player must have x time to get to y exp before they can scale too far
