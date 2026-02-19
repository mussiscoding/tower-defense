# Tower Defense Idle Game

A browser-based tower defense idle game with four elemental mages defending a castle from waves of enemies.

## Tech Stack

- **React 19** + **TypeScript 5.8** + **Vite 7**
- **State Management:** React Context (single GameState in App.tsx)
- **Persistence:** Browser localStorage
- **Node Version:** 20 (see `.nvmrc`)

## Commands

```bash
npm run dev      # Development server with HMR
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Directory Structure

```
src/
├── components/           # React UI components
│   ├── GameArea.tsx      # Main game canvas & game loop (50ms interval)
│   ├── GameSidebar.tsx   # Shop interface, purchases
│   ├── GameHeader.tsx    # Gold/health/time display, pause/reset
│   ├── Mages.tsx         # Element mage management, skill trees
│   └── SkillsRow.tsx     # Skill UI and purchase logic
├── data/                 # Game configuration
│   ├── elements.ts       # Element stats, abilities, XP calculations
│   ├── enemies.ts        # Enemy types (12 types, 2x HP scaling)
│   ├── defenders.ts      # Defender configs linked to elements
│   ├── allSkills.ts      # Centralized skill definitions
│   ├── skillEffects/     # Individual skill implementations
│   ├── upgrades.ts       # Purchasable stat upgrades
│   └── shopItems.ts      # Shop item definitions
├── types/                # TypeScript interfaces
│   └── GameState.ts      # GameState, Enemy, Defender, Arrow, Skill, etc.
├── utils/
│   ├── gameLogic/        # Modular game mechanics
│   │   ├── enemy.ts      # Spawning, movement, damage, death
│   │   ├── defender.ts   # Attack logic, cooldowns, targeting
│   │   ├── arrow.ts      # Arrow creation, flight, impact
│   │   ├── targeting.ts  # Nearest enemy, splash optimization
│   │   ├── effects.ts    # Burn damage over time
│   │   └── waveGenerator.ts  # Difficulty-based wave composition
│   ├── saveSystem.ts     # localStorage serialization
│   └── skillUtils.ts     # Skill purchasing, cooldowns
├── constants/            # Game dimensions, element colors
└── assets/               # Sprites (enemies/, effects/, mages/)
```

## Game Mechanics

### Elements
| Element | Damage | Speed | Signature |
|---------|--------|-------|-----------|
| Fire | 9 | 0.9 | Burn DoT (20%/sec, 2s) |
| Ice | 8 | 1.0 | Slow (5%, 3s) |
| Earth | 15 | 0.5 | Splash (20% radius 50px) |
| Air | 5 | 1.5 | Burst shots (2x attack) |

### Progression
- **Mage slots unlock** every 10 element levels (1 at L1, 2 at L10, etc.)
- **XP:** 1 XP per damage dealt per element
- **Level formula:** `200 * 1.3^(level-1)` XP for next level (cap: 99)
- **Stat scaling:** +10% base damage per level

### Skills System
Skills have event handlers:
- `onAttack` - When defender attacks
- `onHit` - When arrow hits enemy
- `onEnemyDeath` - When enemy dies

Active skills have cooldowns stored in defender's `skillCooldowns` map.

### Targeting
- **Predicted damage tracking:** Maps store predicted arrow/burn damage per enemy to prevent overkilling
- **Smart splash:** Earth defenders can target for max splash damage

## Key Patterns

### ID Generation
Format: `{type}_{timestamp}_{randomstring}`
Example: `enemy_1692302400000_abc123def`

### Element Type
```typescript
type ElementType = "fire" | "ice" | "earth" | "air"
```

### Save System
- Auto-saves every 5 seconds to localStorage key `"towerDefenseSave"`
- Maps/Sets converted to arrays for JSON serialization

## Planning Docs

- `planning_docs/In progress/` - Active work (bugs, features)
- `planning_docs/Completed/` - Finished features

See `planning_docs/In progress/known-bugs.md` for current bug list.

## TODOs in Code

1. **Lightning bolt visual effect** - `src/data/skillEffects/fireLightningBoltOnAttack.ts:21`
   - Add visual lightning bolt effect when skill fires

2. **Milestone upgrades brainstorm** - `planning_docs/In progress/milestone-upgrades-plan.md:631`
   - Schedule brainstorming session for milestone rewards

## Known Bugs (Priority Order)

### Critical
- **Fire XP bug** - Fire only gets XP from initial hit, not burn damage
- **Defender over-targeting** - Defenders fire extra arrows at predicted-dead enemies
- **Multiple arrows bug** - Same arrow processed twice (React state batching)

### Medium
- **Lightning bolt multi-hit** - Appears to hit multiple enemies
- **Upgrade state bug** - Uses `prev.purchases` instead of `updatedState.purchases`

### Low (Polish)
- **Arrow targeting visuals** - Arrows land slightly behind enemies
- **Mage sprite timing** - Attacks appear 3 frames late
- **Splash effect visual** - Visual radius too large
- **Enemy overlay positioning** - Different effects need different manual offsets

## Dev Tips

- Dev mode includes 500g starting gold for testing
- Pause/reset/gold cheat buttons in GameHeader
- Console logs show skill activations
