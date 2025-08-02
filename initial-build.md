# Initial Build Plan - Tower Defense Idle Game

## Overview

Building the MVP version of our tower defense idle game step by step. We'll start with the core mechanics and build up from there.

## Step 1: Project Setup & Types ✅

- [x] Create Vite + React + TypeScript project
- [x] Define TypeScript interfaces (GameState, Enemy, Defender, ShopItem)
- [x] Set up basic project structure

## Step 2: Core Game Structure ✅

- [x] Create basic CSS layout (header, game area, sidebar)
- [x] Implement GameHeader component (gold, health, time)
- [x] Create empty GameArea component (placeholder)
- [x] Create empty GameSidebar component (placeholder)
- [x] Test that the basic layout renders

## Step 3: Basic Enemy System ✅

- [x] Create Enemy component with simple visual representation
- [x] Implement enemy spawning logic (continuous, not waves)
- [x] Add enemy movement from right to left
- [x] Create enemy health bars
- [x] Test enemy spawning and movement

## Step 4: Click Combat System ✅

- [x] Make enemies clickable
- [x] Implement click damage system
- [x] Add visual feedback (damage numbers, hit effects)
- [x] Handle enemy death and gold rewards
- [x] Test clicking mechanics

## Step 5: Castle & Health System ✅

- [x] Create Castle component
- [x] Implement castle health system
- [x] Handle enemies reaching castle (damage castle)
- [x] Add castle destruction mechanic (lose half gold, clear enemies)
- [x] Test castle damage mechanics
- [x] Add pause functionality (button in header)

## Step 6: Basic Defender System ✅

- [x] Create Archer defender component
- [x] Implement automatic targeting (nearest enemy)
- [x] Add basic attack logic
- [x] Create simple archer visual
- [x] Test archer functionality

## Step 7: Shop System ✅

- [x] Create shop item definitions
- [x] Implement GameSidebar with shop items
- [x] Add purchase logic
- [x] Handle gold spending
- [x] Test shop functionality

## Step 8: Difficulty Controls ✅

- [x] Add enemy spawn rate controls (1-5, linear scaling)
- [x] Add enemy difficulty controls (1-3, level 1: goblins only, level 3: all enemy types)
- [x] Implement difficulty UI in GameSidebar
- [x] Update enemy spawning logic to respect difficulty settings
- [x] Test difficulty scaling
- [x] Refactor enemy system with data-driven approach
- [x] Add min/max difficulty levels for enemy spawning

## Step 9: Save System ✅

- [x] Implement auto-save to localStorage
- [x] Add save/load functionality
- [x] Handle save data validation
- [x] Test save system

## Step 10: Basic Polish

- [ ] Add simple animations
- [ ] Implement basic sound effects (optional)
- [ ] Test overall game flow

## File Structure We'll Create:

```
src/
├── components/
│   ├── GameHeader.tsx
│   ├── GameArea.tsx
│   ├── GameSidebar.tsx
│   ├── Enemy.tsx
│   ├── Castle.tsx
│   └── Defender.tsx
├── types/
│   └── GameState.ts ✅
├── utils/
│   ├── gameLogic.ts
│   └── saveSystem.ts
├── data/
│   └── shopItems.ts
└── styles/
    └── game.css
```

## Current Status

- ✅ Project setup complete
- ✅ TypeScript types defined
- ✅ Basic CSS layout and component structure
- ✅ Basic Enemy System
- ✅ Click Combat System
- ✅ Castle & Health System
- ✅ Basic Defender System
- ✅ Shop System
- ✅ Difficulty Controls
- 🔄 Next: Save System

## Notes

- We're building the MVP first, so keeping things simple
- Using basic CSS for styling initially
- Focus on core gameplay loop: click enemies → earn gold → buy defenders → automate combat
- Will add visual polish and advanced features later

Ready to start with Step 2?
