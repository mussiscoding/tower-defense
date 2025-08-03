import type { GameState } from "../types/GameState";

const SAVE_KEY = "towerDefenseSave";

export const saveGame = (gameState: GameState): void => {
  try {
    // Convert Map to array for JSON serialization
    const saveData = JSON.stringify({
      ...gameState,
      predictedArrowDamage: Array.from(
        gameState.predictedArrowDamage.entries()
      ),
      predictedBurnDamage: Array.from(gameState.predictedBurnDamage.entries()),
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

    // Validate and ensure all required fields exist
    const validatedState: GameState = {
      gold: parsed.gold ?? 0,
      castleHealth: parsed.castleHealth ?? 100,
      timeSurvived: parsed.timeSurvived ?? 0,
      clickDamage: parsed.clickDamage ?? 1,
      defenders: parsed.defenders ?? [],
      enemies: parsed.enemies ?? [],
      arrows: parsed.arrows ?? [],
      goldPopups: parsed.goldPopups ?? [],
      splashEffects: parsed.splashEffects ?? [],
      spawnRate: parsed.spawnRate ?? 1,
      lastSave: parsed.lastSave ?? Date.now(),
      isPaused: parsed.isPaused ?? false,
      purchases: parsed.purchases ?? {},
      difficultyLevel: parsed.difficultyLevel ?? 1,
      spawnRateLevel: parsed.spawnRateLevel ?? 1,
      predictedArrowDamage: new Map(parsed.predictedArrowDamage ?? []),
      predictedBurnDamage: new Map(parsed.predictedBurnDamage ?? []),
      elements: parsed.elements ?? {},
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
