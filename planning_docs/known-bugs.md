# Known Bugs

## Fire gets no exp from burn

Major bug.
Fire gets most of its damage from burn, but only exp from the initial hit.

## Earth does not explode if enemy dies first

### Status: ✅ FIXED

**Major bug.**
Earth arrows don't explode if the enemy they were targeting dies before impact
This means that earth loses not just impact damage but also splash damage.

### Fix Applied

- Moved Earth splash damage logic outside the `if (targetEnemy)` block
- Earth arrows now create splash effects even when their target is already dead
- Uses target position if available, otherwise uses arrow end position for splash center
- Splash damage and visual effects work regardless of target status

## Multiple Arrows bug

### Description

The same arrow is being processed multiple times, causing duplicate XP grants.

### Symptoms

- Fire defenders grant 20 XP per shot (should be 10)
- Console logs show different arrow IDs being created
- Two arrows are created per attack cycle instead of one
- Arrow creation logs show duplicate defender attacks
- Air towers clearly show two arrows being fired one after another because of their higher AS

### Root Cause

React state batching issue in the game loop. The defender's `lastAttack` is not being updated immediately, so the defender thinks it can attack again in the next game loop cycle before the state update takes effect.

### Technical Details

- Game loop runs every 50ms
- Defender attack logic checks `canDefenderAttack` based on `lastAttack`
- `lastAttack` is updated in `setGameState` but not immediately available
- Defender is processed twice with the same `lastAttack` value
- Two arrows are created instead of one
- Each arrow grants XP, resulting in double XP

### Investigation Findings

- Arrow ID generation is working correctly (unique IDs)
- Defender attack logic is working correctly
- Issue is in defender state management, not arrow processing
- React state updates are batched, causing timing issues
- Defender's `lastAttack` is not updated immediately in the next cycle

### Potential Solutions

1. **useRef for immediate state access** - Store arrow state in ref to avoid batching delays
2. **Arrow deduplication** - Track processed arrows to prevent duplicate processing
3. **Separate game loops** - Different update frequencies for different systems
4. **Arrow lifecycle management** - Better arrow removal from active arrays

### Status

- **Status**: Known issue, not blocking
- **Priority**: Medium
- **Impact**: Game balance (players progress faster than intended)
- **Workaround**: None currently implemented

---

## Arrow Targeting Bug

### Description

All arrows are landing slightly behind the enemy they are targeting, making it appear as if they don't connect properly. This creates a visual disconnect between the arrow and the enemy.

### Symptoms

- Arrows visually miss their targets
- Arrows land behind moving enemies
- Visual feedback doesn't match actual hit detection
- Arrows appear to pass through enemies without connecting

### Root Cause

Likely an enemy movement prediction issue. The arrow targeting system may not be accounting for enemy movement during the arrow's flight time, causing arrows to aim at where the enemy was rather than where they will be.

### Technical Details

- Arrows are created with a target position
- Enemies continue moving while arrows are in flight
- Arrow targeting doesn't predict enemy movement
- Visual disconnect between arrow trajectory and enemy position

### Potential Solutions

1. **Movement prediction** - Calculate where enemy will be when arrow arrives
2. **Leading shots** - Aim ahead of moving enemies
3. **Adjust arrow speed** - Make arrows faster to reduce prediction errors
4. **Visual feedback adjustment** - Make arrows appear to connect better

### Status

- **Status**: Known issue, low priority
- **Priority**: Low
- **Impact**: Visual polish (doesn't affect gameplay mechanics)
- **Workaround**: None currently implemented

---

## Earth Splash Effect Visual Scaling Issue

### Description

The Earth splash effect visual radius appears much larger than the actual splash damage radius. The visual effect shows arrows shooting to the full 50px radius, but this creates an overly large visual indicator that doesn't match player expectations.

### Symptoms

- Splash effect arrows shoot much further than expected
- Visual effect appears to indicate a much larger splash area than actual damage
- Players may expect splash damage to reach the visual arrows' endpoints
- Visual feedback doesn't match actual gameplay mechanics

### Root Cause

The visual splash effect uses the same radius as the actual splash damage calculation (50px), but 50 pixels is quite large on screen and creates an unrealistic visual expectation.

### Technical Details

- Actual splash radius: 50px (correct for gameplay)
- Visual effect radius: 50px (too large for visual feedback)
- Current workaround: Visual radius scaled to 1/3 (17px) for better appearance
- Splash damage calculation unaffected by visual scaling

### Potential Solutions

1. **Investigate game scale** - Determine if 50px is actually the correct visual scale
2. **Adjust base splash radius** - Reduce the actual splash radius if 50px is too large
3. **Improve visual scaling** - Better algorithm for visual radius scaling
4. **Add visual indicators** - Show actual splash damage area more clearly

### Status

- **Status**: Known issue, workaround implemented
- **Priority**: Low
- **Impact**: Visual polish and player expectations
- **Workaround**: Visual radius scaled to 1/3 of actual radius

---

## Future Bug Reports

Add new bugs to this file as they are discovered.
