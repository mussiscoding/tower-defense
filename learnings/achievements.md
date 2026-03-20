# Achievement Design Patterns

## Standard Level Progression Tiers

For any achievement that tracks a numeric level/milestone with a cap of ~99, use this tier pattern:

**2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99**

This gives players early achievements to feel rewarded quickly (2, 5, 10) and then consistent milestones every 10 levels through to the cap.

## When to Apply

Use this pattern for any tiered achievement group where it makes sense, such as:
- Element levels
- Difficulty levels
- Any other progression system with a similar numeric range

For achievements tracking counts (kills, gold earned, etc.) that scale exponentially, a geometric progression (e.g. 100, 1000, 10000) is more appropriate than the linear level pattern.

## Naming

Each tier should have a unique, thematically escalating name. Avoid reusing the same name across tiers.

## Rewards

Rewards should scale meaningfully across tiers so later achievements feel rewarding relative to the player's current economy.
