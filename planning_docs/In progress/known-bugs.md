# Known Bugs

## 🔥 Priority 1 (Critical)

### Fire gets no exp from burn

**Major bug.**
Fire gets most of its damage from burn, but only exp from the initial hit.

**Status**: Known issue, investigation needed
**Priority**: Critical
**Impact**: Game balance (fire severely underpowered)

---

## ⚠️ Priority 2 (Medium)

### Lightning Bolt Hitting Multiple Enemies

**Description**

The Lightning Bolt skill appears to be hitting multiple enemies simultaneously, even though it should only target the highest HP enemy. Visual observation shows a second enemy (often nearby) also being killed at the same time as the primary target.

**Root Cause**

The skill directly mutates `enemy.health = 0` on the shared array reference, which can cause downstream issues with kill detection and gold rewards.

**Status**: Known issue, investigation needed

---

## 🎨 Priority 3 (Low - Polish)

### Enemy Overlay Positioning Inconsistency

Different visual effects require different manual positioning offsets to appear correctly centered on enemies. Each new overlay effect requires manual trial-and-error positioning.

**Status**: Known issue, workarounds in place (hardcoded per-effect offsets)

---

## ✅ Completed/Fixed

### Earth does not explode if enemy dies first

**Status: FIXED**

Earth arrows now create splash effects even when their target is already dead. Uses target position if available, otherwise uses arrow end position for splash center.

---

### Defender Over-Targeting Bug

**Status: FIXED**

Defenders were firing extra arrows at enemies predicted to die. Fixed with predicted damage tracking - `getEnemiesInRange` now filters out enemies where predicted arrow + burn damage >= health. Predicted damage is correctly reduced on hit and cleaned up on miss/death.

---

### Multiple Arrows Bug

**Status: FIXED**

Same arrow was being processed multiple times due to React state batching. Fixed with a `processedArrowIds` Set in `arrow.ts` that prevents duplicate processing within the same tick.

---

### Upgrade Shop Purchases State Bug

**Status: FIXED**

Was using `prev.purchases` instead of `updatedState.purchases` when handling upgrade shop items. No longer an issue - state management refactored to use ref-based approach that reads directly from `state.core.purchases`.

---

### Mage Sprites Attack Timing

**Status: FIXED**

Attacks appeared 3 frames late. Animation system rebuilt with explicit wind-up/post-attack frame system using `timeUntilNextAttack` and `timeSinceLastAttack`.

---

### Arrow Targeting Visuals

**Status: FIXED**

Arrows were landing behind enemies. Added `calculatePredictedEnemyPosition` in `uiUtils.ts` with movement prediction for arrow targets.

---

### Earth Splash Effect Visual Scaling

**Status: FIXED**

Visual splash radius was much larger than actual damage radius. Visual now uses the same radius as the game mechanic.

---

## Future Bug Reports

Add new bugs to this file as they are discovered.
