import type { GameState } from "../types/GameStateSlices";
import type { MageProgress } from "../types/GameState";
import type { ElementType } from "../data/elements";
import { getBaseDamageWithLevelBonus } from "../data/elements";
import {
  createInitialCoreState,
  createInitialEntityState,
  createInitialVisuals,
  createInitialMageProgress,
} from "./initialState";
import { progressFromTotalStars, getStarDamageMultiplier } from "./starSystem";
import { MAGE_POSITIONS } from "../constants/gameDimensions";

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

    // Migrate mageProgress if missing (old save format)
    const OLD_TIER_MAP: Record<string, number> = { bronze: 0, silver: 1, gold: 2 };
    let mageProgress: Record<ElementType, MageProgress>;
    if (parsed.core?.mageProgress) {
      mageProgress = parsed.core.mageProgress;
      // Migrate old tier names (bronze/silver/gold) to new rank names
      const elementTypesForMigration: ElementType[] = ["fire", "ice", "earth", "air"];
      elementTypesForMigration.forEach((et) => {
        const p = mageProgress[et];
        if (p && p.tier in OLD_TIER_MAP) {
          const oldTotal = OLD_TIER_MAP[p.tier] * 5 + p.stars;
          mageProgress[et] = progressFromTotalStars(oldTotal);
        }
      });
    } else {
      // Derive from existing purchases
      const purchases = parsed.core?.purchases ?? {};
      mageProgress = createInitialMageProgress();
      const elementTypes: ElementType[] = ["fire", "ice", "earth", "air"];
      elementTypes.forEach((et) => {
        const count = purchases[et] || 0;
        const totalStars = count < 3 ? 1 : Math.floor((count - 1) / 2) + 1;
        mageProgress[et] = progressFromTotalStars(totalStars);
      });
    }

    // Recalculate element damage from raw config * star multiplier
    const loadedElements = parsed.core?.elements ?? defaultCore.elements;
    const elementTypes: ElementType[] = ["fire", "ice", "earth", "air"];
    elementTypes.forEach((et) => {
      if (loadedElements[et]) {
        const starMult = getStarDamageMultiplier(mageProgress[et]);
        const baseDamage = getBaseDamageWithLevelBonus(et, loadedElements[et].level);
        loadedElements[et].baseStats.damage = Math.floor(baseDamage * starMult);
      }
    });

    // Migrate defenders: trim to max 2 per element and reposition to fixed slots
    let defenders = parsed.entities?.defenders ?? defaultEntities.defenders;
    elementTypes.forEach((et) => {
      const magesOfType = defenders.filter((d: { type: ElementType }) => d.type === et);
      if (magesOfType.length > 2) {
        // Keep only first 2
        const toRemove = magesOfType.slice(2);
        defenders = defenders.filter((d: { id: string }) => !toRemove.some((r: { id: string }) => r.id === d.id));
      }
      // Reposition to fixed slots
      const remaining = defenders.filter((d: { type: ElementType }) => d.type === et);
      if (remaining.length === 1) {
        remaining[0].y = MAGE_POSITIONS[et].center;
      } else if (remaining.length === 2) {
        remaining[0].y = MAGE_POSITIONS[et].slot1;
        remaining[1].y = MAGE_POSITIONS[et].slot2;
      }
    });

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
        elements: loadedElements,
        mageProgress,
        achievements: parsed.core?.achievements ?? defaultCore.achievements,
        totalEnemiesKilled: parsed.core?.totalEnemiesKilled ?? defaultCore.totalEnemiesKilled,
        totalGoldSpent: parsed.core?.totalGoldSpent ?? defaultCore.totalGoldSpent,
        totalGoldEarned: parsed.core?.totalGoldEarned ?? defaultCore.totalGoldEarned,
        totalMerges: parsed.core?.totalMerges ?? defaultCore.totalMerges,
        totalPowerUpsCollected: parsed.core?.totalPowerUpsCollected ?? defaultCore.totalPowerUpsCollected,
        totalCriticalHits: parsed.core?.totalCriticalHits ?? defaultCore.totalCriticalHits,
        collectedPowerUpTypes: parsed.core?.collectedPowerUpTypes ?? defaultCore.collectedPowerUpTypes,
        activePowerUps: (parsed.core?.activePowerUps ?? []).filter(
          (p: { startTime: number; duration: number }) => Date.now() < p.startTime + p.duration
        ),
      },
      entities: {
        enemies: (parsed.entities?.enemies ?? defaultEntities.enemies).map(
          (e: { enemyType?: string; isGiant?: boolean }) => ({
            ...e,
            enemyType: e.enemyType ?? (e.isGiant ? "giant" : "goblin"),
          })
        ),
        pendingEnemies: [], // Always start fresh - pending enemies are transient
        defenders,
        arrows: [], // Always start fresh - arrows are transient
        vortexes: [], // Always start fresh - vortexes are transient
        spawnedPowerUp: null, // Transient - not saved
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
