import type { GameState } from "../types/GameStateSlices";
import {
  createInitialCoreState,
  createInitialEntityState,
  createInitialVisuals,
} from "./initialState";

const SAVE_KEY = "towerDefenseSave";

export const saveGame = (state: GameState): void => {
  try {
    // Only save persistent state - exclude visual effects and transient entities
    const saveData = JSON.stringify({
      core: state.core,
      entities: {
        enemies: state.entities.enemies,
        defenders: state.entities.defenders,
        // Don't save arrows - they're transient
        // Don't save vortexes - they're transient
      },
      tracking: {
        predictedArrowDamage: Array.from(
          state.tracking.predictedArrowDamage.entries()
        ),
        predictedBurnDamage: Array.from(
          state.tracking.predictedBurnDamage.entries()
        ),
      },
      // Visual effects are NOT saved - they're ephemeral
    });
    localStorage.setItem(SAVE_KEY, saveData);
  } catch (error) {
    console.error("Failed to save game:", error);
  }
};

export const loadGame = (): GameState | null => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) return null;

    const parsed = JSON.parse(savedData);

    // Reconstruct state with defaults for missing fields
    const defaultCore = createInitialCoreState();
    const defaultEntities = createInitialEntityState();

    const validatedState: GameState = {
      core: {
        gold: parsed.core?.gold ?? defaultCore.gold,
        castleHealth: parsed.core?.castleHealth ?? defaultCore.castleHealth,
        timeSurvived: parsed.core?.timeSurvived ?? defaultCore.timeSurvived,
        clickDamage: parsed.core?.clickDamage ?? defaultCore.clickDamage,
        difficultyLevel: parsed.core?.difficultyLevel ?? defaultCore.difficultyLevel,
        isPaused: parsed.core?.isPaused ?? defaultCore.isPaused,
        lastSave: parsed.core?.lastSave ?? defaultCore.lastSave,
        purchases: parsed.core?.purchases ?? defaultCore.purchases,
        elements: parsed.core?.elements ?? defaultCore.elements,
      },
      entities: {
        enemies: parsed.entities?.enemies ?? defaultEntities.enemies,
        pendingEnemies: [], // Always start fresh - pending enemies are transient
        defenders: parsed.entities?.defenders ?? defaultEntities.defenders,
        arrows: [], // Always start fresh - arrows are transient
        vortexes: [], // Always start fresh - vortexes are transient
      },
      tracking: {
        predictedArrowDamage: new Map(parsed.tracking?.predictedArrowDamage ?? []),
        predictedBurnDamage: new Map(parsed.tracking?.predictedBurnDamage ?? []),
      },
      visuals: createInitialVisuals(), // Always start fresh - visuals are ephemeral
    };

    return validatedState;
  } catch (error) {
    console.error("Failed to load game:", error);
    return null;
  }
};

export const clearSave = (): void => {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.error("Failed to clear save:", error);
  }
};

export const hasSaveData = (): boolean => {
  return localStorage.getItem(SAVE_KEY) !== null;
};
