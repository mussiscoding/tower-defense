# Shop Upgrade Filtering Plan

## **Overview**

Currently, all upgrades show in the shop regardless of whether the player has the prerequisite skills. This creates confusion as players see upgrades for abilities they don't have yet.

## **Goal**

Link upgrades to their prerequisite skills and only show upgrades when the associated skill is purchased.

## **Current State Analysis**

### **Upgrade → Skill Mapping**

| Upgrade ID                    | Prerequisite Skill | Current Behavior             |
| ----------------------------- | ------------------ | ---------------------------- |
| `fire_burn_damage_upgrade`    | `fire_burn`        | Always shows under Fire tab  |
| `ice_slow_effect_upgrade`     | `ice_slow`         | Always shows under Ice tab   |
| `earth_splash_damage_upgrade` | `earth_splash`     | Always shows under Earth tab |
| `earth_splash_radius_upgrade` | `earth_splash`     | Always shows under Earth tab |
| `air_burst_shots_upgrade`     | `air_burst`        | Always shows under Air tab   |
| `air_burst_cooldown_upgrade`  | `air_burst`        | Always shows under Air tab   |

### **Current Shop Logic (Mages.tsx:344-363)**

```typescript
{
  upgradeShopItems
    .filter((item) => item.id.startsWith(selectedElement)) // Only element filtering
    .map((item) => {
      // Render upgrade without checking skill prerequisites
    });
}
```

## **Implementation Plan**

### **Phase 1: Add prerequisite field to UpgradeShopItem ✅**

**File:** `src/data/upgrades.ts`

- Add `prerequisiteSkill?: string` to `UpgradeShopItem` interface
- Add prerequisite skill IDs to each upgrade

### **Phase 2: Update shop filtering logic ✅**

**File:** `src/components/Mages.tsx`

- ✅ Update upgrade filter to check both element AND skill prerequisites
- ✅ Only show upgrades where `purchases[prerequisiteSkill] > 0`

### **Phase 3: Type safety updates ✅**

**File:** `src/types/GameState.ts`

- Update `UpgradeShopItem` interface if needed

## **Implementation Details**

### **Upgrade → Skill Mapping**

```typescript
// Fire upgrades
fire_burn_damage_upgrade → fire_burn
// Ice upgrades
ice_slow_effect_upgrade → ice_slow
// Earth upgrades
earth_splash_damage_upgrade → earth_splash
earth_splash_radius_upgrade → earth_splash
// Air upgrades
air_burst_shots_upgrade → air_burst
air_burst_cooldown_upgrade → air_burst
```

### **New Shop Filter Logic**

```typescript
{
  upgradeShopItems
    .filter((item) => {
      // Must match selected element
      const matchesElement = item.id.startsWith(selectedElement);

      // Must have prerequisite skill purchased (if specified)
      const hasPrerequisite =
        !item.prerequisiteSkill || (purchases[item.prerequisiteSkill] || 0) > 0;

      return matchesElement && hasPrerequisite;
    })
    .map((item) => {
      // Render upgrade
    });
}
```

## **Benefits**

1. **🎯 Cleaner Shop**: Only relevant upgrades shown
2. **📚 Better Learning**: Players see what upgrades unlock as they progress
3. **🎮 Improved UX**: No confusion about "useless" upgrades
4. **🔗 Clear Progression**: Visual link between skills and their upgrades

## **Edge Cases to Consider**

1. **Multiple Skills per Upgrade**: Some upgrades might affect multiple skills (none currently, but future-proofing)
2. **Advanced Prerequisites**: Some upgrades might require multiple skills or skill levels
3. **Shop State Persistence**: Ensure filtering works correctly across element tabs
4. **Upgrade Descriptions**: Consider updating descriptions to mention the prerequisite skill

## **Testing Checklist**

**Test Scenario: Fresh Game (No Skills Purchased)**

- [ ] Fire tab: No upgrades visible (requires `fire_burn` skill)
- [ ] Ice tab: No upgrades visible (requires `ice_slow` skill)
- [ ] Earth tab: No upgrades visible (requires `earth_splash` skill)
- [ ] Air tab: No upgrades visible (requires `air_burst` skill)

**Test Scenario: After Purchasing Skills**

- [ ] Fire upgrades only show after purchasing "Fire Burns" skill
- [ ] Ice upgrades only show after purchasing "Ice Freezes" skill
- [ ] Earth upgrades only show after purchasing "Rocks Crash" skill
- [ ] Air upgrades only show after purchasing "Air Burst" skill

**Test Scenario: Mixed States**

- [ ] Element tabs without purchased skills show no upgrades
- [ ] Element tabs with purchased skills show their upgrades
- [ ] Switching between element tabs maintains correct filtering
- [ ] Upgrade purchases still work correctly when shown
- [ ] Shop state persists correctly across game sessions

## **Future Enhancements**

1. **Skill Tree Visualization**: Show upgrade connections in skill interface
2. **Smart Recommendations**: Highlight which skills to buy to unlock desired upgrades
3. **Upgrade Previews**: Show "locked upgrade" placeholders with prerequisites
4. **Batch Purchases**: Allow purchasing skill + upgrades together
