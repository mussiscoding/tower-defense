---
date: 2026-03-20
topic: empower-click
---

# Empower Click — Brainstorm

## What We're Building

A repeatable upgrade that snapshots the player's strongest mage's current base damage as their click damage. This is the primary click scaling mechanism for the game.

## Why Clicking Exists

Clicking serves two purposes:
1. **Early game bootstrap** — before mages, clicking is the only way to kill enemies and earn gold
2. **Engagement reward** — a small bonus for active players that says "thanks for being here" without punishing AFK

Clicking is NOT meant to be a primary damage strategy. It should never rival mage DPS. Inspired by Cookie Clicker's model where clicking yields roughly 1-5% of passive production for most of the game.

## The Mechanic

**Empower Click** is a repeatable upgrade that sets click damage to the player's strongest mage's current base damage at time of purchase.

### The Loop

1. Player starts with 1 click damage
2. Buys first mage, mage does ~5 base damage
3. Buys "Empower Click I" → click damage snaps to 5
4. Clicks feel powerful for a while
5. Mage levels up, base damage grows to 15, 45, etc.
6. Click damage stays at 5 — feels increasingly weak
7. Player buys "Empower Click II" → click damage snaps to current strongest (e.g. 45)
8. Repeat

This creates a satisfying buy → decay → buy cycle. Each purchase feels like a meaningful power spike that naturally fades.

### Player Strategy

The optimal play is: level up your strongest mage, *then* buy Empower Click to capture peak value. This feels like "gaming the system" in a fun way.

## Cost Scaling

Fixed 10x exponential:

| Upgrade | Cost |
|---|---|
| Empower Click I | 1,000g |
| Empower Click II | 10,000g |
| Empower Click III | 100,000g |
| Empower Click IV | 1,000,000g |
| Empower Click V | 10,000,000g |

Formula: `1000 * 10^(n-1)` where n is the purchase number.

If players buy too frequently (upgrade feels trivial), swap to 100x exponential.

## Shop Placement

- New **"General"** section in the shop, separate from element-specific upgrades
- Not available until the player owns at least one mage
- Also add current click damage to Game Stats display

## Key Decisions

- **Snapshot, not live link**: Click damage is set at purchase time, not dynamically tied to mage damage. This creates the decay loop.
- **Fixed exponential cost, not mage-damage-scaled**: Preserves the fun of "star up my mage then immediately buy Empower Click." Scaling cost with mage damage would remove that strategic moment.
- **No early-game flat upgrades**: Player buys a mage early enough that we don't need "+1 click damage" upgrades before Empower Click.
- **Named sequentially**: Empower Click I, II, III — clear and simple.

## Open Questions

- How many purchases realistically happen in a full playthrough? Probably 4-5 given the 10x cost scaling.
- Does the upgrade button show what your click damage *would become* if you bought it? (Probably yes — good UX.)

## Next Steps

→ Plan and implement
