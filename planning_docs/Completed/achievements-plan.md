# Achievements System

## Overview

Achievements reward players for hitting milestones and discovering mechanics. Every achievement gives a gold reward (no gameplay bonuses for now). Achievements are tracked persistently and displayed in the Stats sidebar tab.

---

## Pop-up Notification (Center Splash)

When an achievement unlocks, a **centered splash card** appears over the game area:

- Fades in with a brief flash/glow effect at center of the game area
- Shows: achievement icon, name, description, gold reward amount
- Stays for ~3 seconds, then fades out
- Queued if multiple trigger at once (show one at a time, next appears after current fades)
- Non-blocking - gameplay continues behind it
- Gold border with a radial glow pulse on appear

**Component:** `<AchievementPopup>` rendered in `GameArea.tsx`, reads from a queue in visual state.

---

## Tracking & Checking

**In state:** `core.achievements: Record<string, number>` (achievement ID -> timestamp unlocked, 0 = locked)

**Achievement definitions** in `src/data/achievements.ts`:

- Each achievement has: id, name, description, icon, reward, category, hidden flag, and a `check` function
- Check functions run against game state and return true/false
- On unlock: set timestamp, add gold reward, push to visual notification queue

### Two checking strategies

**State-based achievements** (polled every ~1s / 20 ticks):

- Kill counts, gold held, difficulty reached, element levels, ranks, etc.
- A periodic check runs all state-based `check(state)` functions
- Cheap: most return early because they're already unlocked (single map lookup)

**Event-based achievements** (triggered from game logic):

- Achievements that depend on transient information not persisted in state
- A `tryUnlockAchievement(id, state)` helper is called from the relevant game code
- Returns immediately if already unlocked (map lookup), otherwise runs the check
- Grouped by event to minimize calls:
  - **On arrow hit:** overkill, critical_hit
  - **On enemy death:** burn_kill, slow_kill, giant_killer
  - **On splash:** splash_multi
  - **On UI action:** stats_man (opening stats tab)
- Scales well — even at 10x the current achievement count, the cost is negligible since unlocked achievements early-return

**New tracking fields** needed in `CoreState`:

- `totalEnemiesKilled: number`
- `totalGiantEnemiesKilled: number`
- `totalGoldSpent: number`
- `totalGoldEarned: number`
- `totalMerges: number`

These accumulate over the game lifetime and are never reset.

---

## Stats Tab Display (Icon Grid)

In the Stats sidebar tab, below existing stats:

**Layout:**

- Header: "Achievements (12/28)" with count
- Compact grid of circular icons (4-5 per row)
- **Unlocked:** Full color icon with a subtle glow. Click/hover shows tooltip with name, description, reward earned.
- **Locked (visible):** Greyed out icon with a hint tooltip (e.g., "Kill 1,000 enemies")
- **Locked (hidden):** Dark icon with "???" tooltip - no hint until unlocked
- **In-progress:** For trackable achievements, show a small progress ring around the icon (e.g., 347/1,000 fill). Tooltip shows exact numbers.

**Sorting:**

- Unlocked first (most recent at top),
- then in-progress by completion %,
- then locked,
- then hidden.

---

## Achievement Structure

### Tiered vs Standalone (Mix approach)

**Tiered achievements** group natural progressions under one slot that upgrades:

- Enemy kills: Century (100) -> Slayer (1K) -> Exterminator (10K)
- Gold held: Savings (1K) -> Rich (10K) -> Wealthy (100K)
- Each tier gives its own gold reward when reached.
- Only one tier is in progress at any one time. Future tiers are locked.

**Standalone achievements** are one-off discoveries/milestones:

- First Blood, Giant Killer, Burn Notice, etc.

### Hidden Achievements

A few fun/surprising achievements show as "???" with no hint. Examples:

- Overkill (deal 100x an enemy's max HP in one hit)
- Stats Man (check the stats page)

---

## Achievement List (~28 achievements)

### Getting Started (4, all standalone)

| ID           | Achievement         | Trigger                               | Reward | Hidden |
| ------------ | ------------------- | ------------------------------------- | ------ | ------ |
| first_kill   | First Blood         | Kill your first enemy                 | 50g    | No     |
| first_mage   | Apprentice Trainer  | Train your first mage                 | 100g   | No     |
| all_elements | Elemental Diversity | Have all 4 element types on the field | 200g   | No     |
| first_skill  | Upgrade Path        | Purchase your first skill             | 100g   | No     |

### Progression (7, mix of tiered and standalone)

| ID              | Achievement     | Trigger                         | Reward   | Hidden |
| --------------- | --------------- | ------------------------------- | -------- | ------ |
| first_merge     | Rising Star     | Merge a mage for the first time | 500g     | No     |
| rank_apprentice | Apprentice Rank | Reach Apprentice on any element | 1,000g   | No     |
| rank_journeyman | Journeyman Rank | Reach Journeyman on any element | 5,000g   | No     |
| rank_adept      | Adept Rank      | Reach Adept on any element      | 25,000g  | No     |
| rank_mage       | Master Mage     | Reach Mage rank on any element  | 100,000g | No     |
| level_10        | Scholar         | Reach element level 10          | 500g     | No     |
| level_25        | Professor       | Reach element level 25          | 2,500g   | No     |
| level_50        | Sage            | Reach element level 50          | 10,000g  | No     |

### Combat (8, tiered kill chain + standalone discoveries)

| ID           | Achievement     | Trigger                          | Reward | Hidden |
| ------------ | --------------- | -------------------------------- | ------ | ------ |
| kills_100    | Century         | Kill 100 enemies (tiered 1/3)    | 200g   | No     |
| kills_1000   | Slayer          | Kill 1,000 enemies (tiered 2/3)  | 1,000g | No     |
| kills_10000  | Exterminator    | Kill 10,000 enemies (tiered 3/3) | 5,000g | No     |
| giant_killer | Giant Killer    | Kill your first giant enemy      | 500g   | No     |
| burn_kill    | Burn Notice     | Kill an enemy with burn damage   | 200g   | No     |
| slow_kill    | Shattered       | Kill a slowed enemy              | 200g   | No     |
| splash_multi | Splash Zone     | Hit 3+ enemies with one splash   | 300g   | No     |
| critical_hit | Critical Strike | Land a critical hit              | 200g   | No     |

### Wealth (4, tiered gold chain + standalone)

| ID          | Achievement     | Trigger                                | Reward | Hidden |
| ----------- | --------------- | -------------------------------------- | ------ | ------ |
| gold_1000   | Savings Account | Hold 1,000 gold at once (tiered 1/3)   | 200g   | No     |
| gold_10000  | Rich            | Hold 10,000 gold at once (tiered 2/3)  | 500g   | No     |
| gold_100000 | Wealthy         | Hold 100,000 gold at once (tiered 3/3) | 2,000g | No     |
| spend_10000 | Big Spender     | Spend 10,000 gold total                | 1,000g | No     |

### Difficulty & Survival (5, tiered chains)

| ID          | Achievement | Trigger                          | Reward  | Hidden |
| ----------- | ----------- | -------------------------------- | ------- | ------ |
| diff_5      | Brave       | Reach difficulty 5 (tiered 1/3)  | 500g    | No     |
| diff_10     | Fearless    | Reach difficulty 10 (tiered 2/3) | 2,000g  | No     |
| diff_50     | Legendary   | Reach difficulty 50 (tiered 3/3) | 10,000g | No     |
| survive_10m | Survivor    | Survive 10 minutes (tiered 1/3)  | 300g    | No     |
| survive_30m | Enduring    | Survive 30 minutes (tiered 2/3)  | 1,000g  | No     |

### Hidden (2, all standalone)

| ID        | Achievement | Trigger                                | Reward | Hidden |
| --------- | ----------- | -------------------------------------- | ------ | ------ |
| overkill  | Overkill    | Deal 100x an enemy's max HP in one hit | 500g   | Yes    |
| stats_man | Stats Man   | Check the stats page                   | 100g   | Yes    |

**Total: 26 achievements** (24 visible, 2 hidden)

---

## Data Model

```typescript
interface AchievementDef {
  id: string;
  name: string;
  description: string; // shown in tooltip when unlocked
  hint?: string;       // shown in tooltip when locked (omit for hidden)
  icon: string;        // emoji for now
  reward: number;      // gold
  category: "start" | "progression" | "combat" | "wealth" | "difficulty" | "hidden";
  hidden: boolean;     // true = show "???" when locked
  tieredGroup?: string;  // e.g., "kills" - achievements in same group share one grid slot
  tieredOrder?: number;  // display order within the tier (1, 2, 3)
  checkType: "state" | "event";  // state = polled periodically, event = triggered from game logic
  check: (state: GameState) => boolean;
  // For progress display:
  getProgress?: (state: GameState) => { current: number; target: number };
}

// Helper for event-based achievements - called from game logic
function tryUnlockAchievement(id: string, state: GameState): boolean;
// Returns false immediately if already unlocked (cheap map lookup)
// Otherwise runs the achievement's check function

// New fields in CoreState:
achievements: Record<string, number>;  // id -> unlock timestamp (0 = locked)
totalEnemiesKilled: number;
totalGiantEnemiesKilled: number;
totalGoldSpent: number;
totalGoldEarned: number;
totalMerges: number;

// New in VisualEffects:
achievementQueue: string[];  // achievement IDs waiting to show popup
```

---

## Implementation Order

1. Add tracking fields to CoreState + save migration
2. Create `achievements.ts` with all definitions + `tryUnlockAchievement` helper
3. Add state-based achievement polling to game loop (every 20 ticks)
4. Wire up event-based achievement triggers in game logic (arrow hit, enemy death, splash, UI actions)
5. Build `<AchievementPopup>` component with center splash animation
6. Build achievement grid in Stats tab
7. Wire up progress tracking (increment kill/gold counters in existing code)
