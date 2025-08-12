# 🎯 **Skills System Refactor: From Purchase Checks to Event Handlers**

## **Overview**

We're refactoring from scattered `purchases["skill_id"]` checks throughout the codebase to a clean event-driven skill system where skills define their own behavior through event handlers.

## **Current State vs Target State**

### **Before (Current):**

```typescript
// Scattered throughout defender.ts, arrow.ts, etc.
if (purchases["fire_burn"] > 0) {
  // burn logic here
}
if (purchases["air_burst"] > 0) {
  // burst logic here
}
```

### **After (Target):**

```typescript
// In skills.ts
{
  id: "fire_burn",
  category: "attack_modifier",
  onHit: (arrow, enemy, damage, gameState) => {
    // burn logic here
  }
}

// In arrow.ts
arrow.onHitEffects.forEach(skill => skill.onHit(arrow, enemy, damage, gameState));
```

---

## **📋 Implementation Checklist**

### **Phase 1: Foundation & Types** ✅

- [x] Add skill event handler types to `Skill` interface
- [x] Add `category` field to `Skill` interface (`attack_modifier` | `active` | `spell`)
  - `attack_modifier` affects normal arrows
  - `active` attacks replace normal arrows (defender abilities)
  - `spell` is player cast (we don't have any yet)
- [x] Add `priority` and `cooldown` fields for spells
- [x] Add `onHitEffects` field to `Arrow` interface
- [x] Add cooldown tracking fields to `Defender` interface

### **Phase 2: Skill Utilities** ✅

- [x] Create `getActiveSkillsForElement(elementType, category?)` function
- [x] Create `getAllActiveSkills()` function
- [x] Add skill cooldown management utilities

### **Phase 3: Update Skill Definitions** ✅

- [x] Convert basic skills to use event handlers instead of placeholder effects
  - [x] `fire_burn` → `onHit` handler
  - [x] `ice_slow` → `onHit` handler
  - [x] `earth_splash` → `onHit` handler
  - [x] `air_burst` → `onAttack` handler (active category)
- [x] Add `category` to all existing skills
- [x] Add `priority` to active skills
- [x] Remove obsolete `SkillEffect` interface and `effect` field from skills

### **Phase 4: Refactor Defender Logic** ✅

- [x] Remove hardcoded burst logic from `updateDefenders()`
- [x] Add active priority system to `updateDefenders()`
- [x] Attach `onHitEffects` to arrows when created
- [x] Add cooldown management for active skills
- [x] Test active abilities replace normal attacks

### **Phase 5: Refactor Arrow Logic** ✅

- [x] Remove hardcoded element effect checks from `processArrowImpacts()`
- [x] Execute `arrow.onHitEffects` on arrow impact
- [x] Remove calls to `addElementEffects()` function
- [x] Test all attack modifier skills work via event handlers

### **Phase 6: Clean Up Legacy Code** ✅

- [x] Remove `calculateElementAbilities()` basic skill checks (kept for UI only)
- [x] Remove `addElementEffects()` function if no longer needed
- [x] Remove hardcoded element logic from game files
- [x] Update any remaining `purchases["skill_id"]` checks

### **Phase 7: Testing & Validation**

- [ ] Test basic skills still work (burn, slow, splash, burst)
- [ ] Test skill purchase/effect flow end-to-end
- [ ] Test active priority and cooldowns
- [ ] Test multiple attack modifiers stacking
- [ ] Performance test with many simultaneous effects

---

## **📝 Implementation Notes**

### **Skill Categories:**

- **`attack_modifier`**: Passive effects on every attack (burn, chain lightning, splash)
- **`active`**: Defender abilities that replace normal attacks (frost nova, meteor, burst)
- **`spell`**: Player-triggered abilities (freeze all, shield, rain of fire)

### **Event Handler Signatures:**

```typescript
onAttack?: (defender: Defender, target: Enemy, gameState: GameState) => void;
onHit?: (arrow: Arrow, enemy: Enemy, damage: number, gameState: GameState) => void;
onEnemyDeath?: (enemy: Enemy, killer: Arrow, gameState: GameState) => void;
canCast?: (defender: Defender, gameState: GameState) => boolean;
```

### **Performance Optimizations:**

- Skills attached to arrows at creation time (not looked up at impact)
- Skill lookups can be cached/memoized
- Only execute skills that are actually purchased

### **Migration Strategy:**

- Keep old system working during refactor
- Migrate one skill type at a time
- Test each phase before proceeding
- Remove legacy code only after new system is proven

---

## **🎯 Success Criteria**

✅ **No more scattered `purchases["skill_id"]` checks**  
✅ **All skill logic contained within skill definitions**  
✅ **Game logic is skill-agnostic (just calls event handlers)**  
✅ **Performance equal or better than current system**  
✅ **Easy to add new skills without modifying game logic**

// NEW approach with skill events:

```typescript
export const updateDefenders = (defenders, enemies, currentTime, ...) => {
  const updatedDefenders = defenders.map((defender) => {
    if (!canDefenderAttack(defender, currentTime)) return defender;

    const target = findNearestEnemy(defender, currentEnemies);
    if (!target) return defender;

    // Check for available spells first
    const activeSkills = getActiveSkillsForDefender(defender, "active");
    const availableSpell = activeSkills
      .filter(skill => skill.canCast?.(defender, gameState))
      .sort((a, b) => b.priority - a.priority)[0];

    if (availableSpell) {
      // Cast spell instead of normal attack
      availableSpell.onAttack?.(defender, target, gameState);
    } else {
      // Normal attack + attack modifiers
      const arrow = createArrow(...);
      // In defender.ts - when creating arrow:
const arrow = createArrow(...);
const hitModifierSkills = getActiveSkillsForElement(defender.type, "attack_modifier");
arrow.onHitEffects = hitModifierSkills.filter(skill => skill.onHit);

      newArrows.push(arrow);

      // Apply attack modifier skills
      const modifierSkills = getActiveSkillsForDefender(defender, "attack_modifier");
      modifierSkills.forEach(skill => {
        skill.onAttack?.(defender, target, gameState);
      });
    }
  });
};

// NEW approach with skill events:
export const processArrowImpacts = (arrows, enemies, currentTime, ...) => {
  arrows.forEach((arrow) => {
    const targetEnemy = enemies.find(e => e.id === arrow.targetEnemyId);
    if (!targetEnemy || !hasArrowReachedTarget(arrow, targetEnemy, currentTime)) return;

    // Calculate base damage
    const baseDamage = calculateArrowDamage(arrow);

    // Apply all attack_modifier skills that affect hits
    // In arrow.ts - when processing impacts:
arrow.onHitEffects.forEach(skill => {
  skill.onHit(arrow, targetEnemy, baseDamage, gameState);
});

    // Apply final damage
    targetEnemy.health -= baseDamage;

    // Check for enemy death and trigger death skills
    if (targetEnemy.health <= 0) {
      const deathSkills = getAllActiveSkills().filter(s => s.onEnemyDeath);
      deathSkills.forEach(skill => {
        skill.onEnemyDeath?.(targetEnemy, arrow, gameState);
      });
    }
  });
};

```
