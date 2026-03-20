# Next Steps

Planning doc for the next batch of features and improvements.

---

# High Priority

## Rethink Upgrades

Current upgrades are tied to skills but feel disconnected from the star/leveling system.

### Current State

- 10 upgrades in `upgrades.ts`, all tied to specific skill prerequisites.
- Costs range from 1,000 to 50,000 gold with 2x scaling.
- They boost skill-specific stats (burn damage %, slow %, splash radius, etc.).
- No general upgrades (global damage, attack speed, gold multiplier, etc.).
- Later upgrades (50k gold) may never be reachable in normal play.

### Problems

- Costs don't align well with gold income at different stages.
- Some increases are very imbalanced, for example more arrows for the air mage, and splash radius on earth.
- Many abilities don't have upgrades
- If every ability has an upgrade, does the shop get messy?
- Are most of the upgrades just "does more damage"? How do we make them feel unique?

### Action

- Brainstorm session needed. Map out the gold economy first (income per wave at various difficulties), then design upgrades that fit the curve.

---

## ~~Mage Sprites~~ DONE

Implemented Option B (CSS filter tinting). All four elements now use the same sprite set with per-element color filters. Fire = red/orange, Ice = blue/cyan, Earth = green/brown, Air = bright white/grey. Can revisit with unique sprites later if desired.

---

# Medium Priority

## Click-to-Damage (Early Game Rework)

Changes the early game feel significantly.

The game currently starts with mages already present. Instead, the player should start with nothing and click enemies to deal damage manually.

### Design

- **No mages at start.** Player clicks enemies to damage them.
- **Click damage:** ~1/5 to 1/10 of first enemy's HP per click (so 5-10 clicks to kill wave 1 enemies).
- **First mage costs ~20 gold** (4-5 kills to afford).
- **Click damage scaling:** Scales with your strongest mage's damage so it stays relevant - maybe not, maybe this comes from upgrades
- **Future: Element-Linked Clicks** — Let the player choose which mage element their clicks represent. Ideas / musings:
  - If linked to Fire: clicks apply burn DoT (player can set loads of enemies alight)
  - If linked to Ice: clicks apply slow/permafrost (crowd control by clicking)
  - If linked to Earth: clicks deal splash damage
  - If linked to Air: clicks crit
  - **Open question: how to unlock this.** Options considered:
    - As a powerup — bad, because it dilutes the powerup pool and reduces other powerup chances
    - As a purchasable ability/upgrade — probably better
    - As part of a "Player Spells" system (not yet implemented) — could be a spell with a cooldown
    - As a skill tree unlock per element — each element has a "click attunement" skill
  - Balance consideration: element-linked clicks add *utility* (burn spread, CC) not just raw damage, which is more interesting than flat damage boosts
  - This is a separate feature from click damage upgrades — park for after base click scaling is working

### Implementation Notes

- Add click handler on enemies in GameArea/Enemy component.
- New state: `clickDamage` base value, derived from max mage damage.
- Visual feedback on click (damage number popup, hit flash).
- Adjust starting gold (no more 500g dev mode default for real play).
- First mage purchase in shop unlocks the mage system.

### Open Questions

- Does clicking pause while game is paused? Yes
- Should there be a click speed limit (prevent auto-clickers)?
- Visual: cursor change on hover over enemies?

---

## New Enemy Types

Adds variety and strategic depth.

### Current State

- One enemy class with procedural HP variation.
- Giants (10% chance at difficulty 3+): 1.5x budget, 2x visual scale.
- 12 random shirt colors for visual variety.
- All enemies have the same speed (1.0 base).

### Enemy Type Ideas

| Type              | Behavior                                  | Frequency | Notes                                  |
| ----------------- | ----------------------------------------- | --------- | -------------------------------------- |
| **Fast Runner**   | 2-3x speed, low HP                        | Common    | Forces prioritization decisions        |
| **Armored**       | Damage reduction (flat or %)              | Uncommon  | Rewards high single-hit damage (earth) |
| **Healer**        | Heals nearby enemies slowly               | Rare      | Must be targeted first                 |
| **Splitter**      | Splits into 2 smaller enemies on death    | Uncommon  | Tests AoE and sustained damage         |
| **Dodger**        | % chance to dodge attacks                 | Uncommon  | Could be frustrating — needs testing   |
| **Shield Bearer** | Absorbs first N hits regardless of damage | Rare      | Rewards fast attackers (air)           |
| **Swarm**         | Tiny, lots of them, very low HP           | Wave type | Tests AoE (earth splash)               |

### Recommended First Additions

1. **Fast Runner** — Simplest to implement (just change speed), biggest gameplay impact.
2. **Armored** — Simple damage reduction, encourages element diversity.
3. **Swarm wave** — Just many low-HP enemies, tests splash/AoE.

### Implementation Notes

- Add `enemyType` field to Enemy interface.
- Type determines: speed multiplier, HP multiplier, special behavior, visual.
- Wave generator picks types based on difficulty thresholds.
- Each type needs a visual indicator (color tint, size, icon overlay, or unique sprite).

---

## Sound

Game feel and engagement.

### Approach

- Use the Web Audio API — built into all browsers, no libraries needed.
- Generate simple sound effects programmatically (no asset files required).
- Procedural sounds: clicks, hits, spell casts, enemy death, gold pickup.

### What to Investigate

- Can we generate decent-sounding effects with just oscillators and noise?
- Howler.js as a lightweight alternative if Web Audio is too raw.
- Free sound effect libraries (freesound.org, mixkit.co).
- Volume control + mute toggle in UI.

### Key Sounds

- Enemy click/hit
- Enemy death
- Arrow impact
- Spell activation
- Wave start/clear
- Mage purchase
- Gold earned

---

## Introduction / Tutorial Tooltips

Players won't know what to do without guidance.

### Concept

Contextual tooltip popups that guide new players through the first few minutes.

### Tooltip Sequence

1. "Click enemies to damage them!" — On first enemy spawn.
2. "Earn gold by defeating enemies." — On first kill.
3. "Buy your first mage in the shop!" — When player has enough gold.
4. "Mages attack automatically. Level them up for more damage!" — After first mage purchase.
5. "You control the pace. Increase enemy difficulty for more rewards." - After second mage purchase / upgrade
6. "Unlock skills in the mage panel to power up your defenders." — When first skill is available.

### Implementation Notes

- Simple state machine: track which tips have been shown.
- Persist shown tips in save data (don't re-show on reload).
- Dismissable (click to close or auto-dismiss after X seconds).
- Non-blocking — don't pause the game.
- Positioned near the relevant UI element (arrow pointing to shop, etc.).

---

# Low Priority

## Background & Visual Polish

Quick wins for game feel.

### Current State

- Brown/muddy background color.
- Functional but not appealing.

### Ideas

- **Gradient background** — simple sky-to-ground gradient (blue top, green bottom).
- **Parallax layers** — subtle scrolling background elements (clouds, trees).
- **Castle asset** — simple castle/tower graphic on the left side.
- **Path/road** — visual path that enemies walk along instead of random Y positions.
- **Day/night cycle** — background shifts color over time (purely cosmetic).

### Quick Win

Just swap the brown for a pleasant gradient. Can be done in 5 minutes in CSS.

---

## Spells (Player-Activated Abilities)

Adds active engagement to the idle gameplay.

### Concept

Clickable spell icons with long cooldowns (10 minutes to 1 hour). These are powerful abilities the player triggers manually.

### Spell Ideas

| Spell        | Effect                                  | Cooldown  | Notes                        |
| ------------ | --------------------------------------- | --------- | ---------------------------- |
| Earthquake   | Damage all enemies on screen            | 10-15 min | % of max HP or flat damage?  |
| Gold Pot     | Bonus gold for X seconds                | 30 min    | 2x or 3x gold multiplier     |
| Freeze All   | Freeze all enemies for X seconds        | 15 min    | Complete stop, not just slow |
| Meteor Storm | Rain damage over time across the field  | 20 min    | Visual spectacle             |
| Healing Wave | Restore castle HP                       | 1 hour    | Safety net for tough waves   |
| Rage         | All mages attack 2x speed for X seconds | 15 min    | Big damage window            |

### Implementation Notes

- New UI row/bar for spell icons (below game area or in sidebar).
- Spell state: cooldown remaining, whether unlocked.
- Spells could be unlocked via upgrades, achievements, or level thresholds.
- Visual cooldown indicator (radial sweep or countdown timer on icon).
- Spells should feel impactful — big visual + sound when cast.

### Open Questions

- How are spells unlocked? Purchase? Level milestone? Achievement reward?
- Do spell cooldowns tick while game is paused?
- Do spell cooldowns persist across sessions (save/load)?
- Should spells scale with difficulty/level?

---

## Priority Summary

| #   | Feature           | Priority | Effort  | Impact                        |
| --- | ----------------- | -------- | ------- | ----------------------------- |
| 1   | Rethink upgrades  | High     | High    | High — core progression loop  |
| 2   | Mage sprites      | High     | Low-Med | Medium — visual clarity       |
| 3   | Click-to-damage   | Medium   | Medium  | High — fixes empty early game |
| 4   | New enemy types   | Medium   | Medium  | High — variety and strategy   |
| 5   | Sound             | Medium   | Medium  | Medium — game feel            |
| 6   | Tutorial tooltips | Medium   | Low     | High — onboarding             |
| 7   | Background polish | Low      | Low     | Low — quick visual win        |
| 8   | Spells            | Low      | Medium  | Medium — active engagement    |

### Suggested Order of Work

1. **Background polish** — 5-minute quick win, do it first.
2. **Mage sprites** (tinting approach) — Quick visual improvement.
3. **Rethink upgrades** — Needs brainstorming, bigger effort.
4. **Sound** — Investigate Web Audio API, procedural sounds.
5. **New enemy types** (fast runner first) — Adds variety.
6. **Click-to-damage** — Early game rework.
7. **Tutorial tooltips** — Builds on click-to-damage flow.
8. **Spells** — Layer on later when core loop is solid.
