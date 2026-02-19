# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This is a tower defense idle game built with React 19, TypeScript, and Vite. Players defend a castle from waves of enemies using elemental mages (fire, ice, earth, air) that attack automatically. The game features:
- Wave-based enemy spawning with scaling difficulty
- Four element types with unique abilities (burn, slow, splash, burst)
- Skill trees unlocked by element level progression
- XP/leveling system per element
- Persistent save system using localStorage

## Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint with React hooks + TypeScript rules
npm run preview  # Preview production build locally
```

## Architecture

### State Management
All game state lives in `App.tsx` as a single `GameState` object (see `src/types/GameState.ts`). State flows down via props to child components. The main game loop runs in `GameArea.tsx` at 50ms intervals and handles:
- Enemy movement and vortex effects
- Burn damage processing
- Defender attacks and arrow creation
- Arrow impacts and damage resolution
- Element XP/level-up detection

### Data Layer (`src/data/`)
- `elements.ts` - Base stats/abilities for each element type, XP calculations
- `enemies.ts` - Programmatic enemy generation (12 types, 2x HP scaling)
- `defenders.ts` - Defender configurations linked to elements
- `allSkills.ts` - Skill definitions with unlock requirements, base values, and event handlers
- `upgrades.ts` - Purchasable upgrades that enhance skills
- `shopItems.ts` - Combines defenders + upgrades for the shop UI

### Game Logic (`src/utils/gameLogic/`)
Organized by domain:
- `enemy.ts` - Spawning, movement, damage, death handling
- `defender.ts` - Attack logic, cooldown management
- `arrow.ts` - Projectile creation, flight progress, impact processing
- `targeting.ts` - Nearest enemy and splash target selection
- `effects.ts` - Burn damage over time processing
- `waveGenerator.ts` - Difficulty-based enemy wave composition
- `index.ts` - Re-exports all functions + mage slot calculations

### Skill System
Skills are defined in `src/data/allSkills.ts` with event handlers:
- `onAttack` - Triggered when defender attacks (before arrow)
- `onHit` - Triggered when arrow hits enemy
- `onEnemyDeath` - Triggered when enemy dies

Skill effect implementations live in `src/data/skillEffects/`. Skills use `SkillContext` for accessing game state without full GameState coupling.

### Key Patterns
- Element types are: `"fire" | "ice" | "earth" | "air"` (see `ElementType`)
- IDs use format: `type_timestamp_randomstring` (e.g., `defender_1234567890_abc123def`)
- Predicted damage tracking via `predictedArrowDamage` and `predictedBurnDamage` Maps for accurate targeting
- Skill values calculate using `calculateSkillValue(baseValue, upgradeId, purchases)`
- Save system serializes/deserializes Maps and Sets specially in `saveSystem.ts`

### Components (`src/components/`)
- `GameArea.tsx` - Main game canvas, orchestrates game loop and renders entities
- `GameSidebar.tsx` - Shop, difficulty controls, mage management
- `GameHeader.tsx` - Gold, health, time display, pause/reset
- `Enemy.tsx`, `Defender.tsx`, `Arrow.tsx` - Entity rendering
- `Mages.tsx` - Element-specific mage management and skill display
- Visual effects: `SplashEffect`, `VortexEffect`, `DamageNumber`, `FloatingText`, etc.

### Constants
- `src/constants/gameDimensions.ts` - Castle width, spawn positions
- `src/constants/elementColors.ts` - Color schemes per element
