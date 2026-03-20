import type { ElementData, MageProgress } from "../types/GameState";
import type {
  CoreState,
  EntityState,
  TrackingState,
  VisualEffects,
  GameState,
} from "../types/GameStateSlices";
import {
  getAvailableElements,
  createInitialElementData,
} from "../data/elements";
import type { ElementType } from "../data/elements";

export const createInitialElements = (): Record<ElementType, ElementData> => {
  return getAvailableElements().reduce(
    (acc, elementType) => {
      acc[elementType] = createInitialElementData(elementType);
      return acc;
    },
    {} as Record<ElementType, ElementData>,
  );
};

export const createInitialMageProgress = (): Record<
  ElementType,
  MageProgress
> => {
  return getAvailableElements().reduce(
    (acc, elementType) => {
      acc[elementType] = { stars: 1, tier: "initiate" };
      return acc;
    },
    {} as Record<ElementType, MageProgress>,
  );
};

export const createInitialCoreState = (): CoreState => ({
  gold: 50,
  castleHealth: 100,
  timeSurvived: 0,
  clickDamage: 1,
  difficultyLevel: 1,
  isPaused: false,
  lastSave: Date.now(),
  purchases: {},
  elements: createInitialElements(),
  mageProgress: createInitialMageProgress(),
  achievements: {},
  totalEnemiesKilled: 0,
  totalGoldSpent: 0,
  totalGoldEarned: 0,
  totalMerges: 0,
  totalPowerUpsCollected: 0,
  totalCriticalHits: 0,
  collectedPowerUpTypes: [],
  activePowerUps: [],
});

export const createInitialEntityState = (): EntityState => ({
  enemies: [],
  pendingEnemies: [],
  defenders: [],
  arrows: [],
  vortexes: [],
  spawnedPowerUp: null,
});

export const createInitialTrackingState = (): TrackingState => ({
  predictedArrowDamage: new Map(),
  predictedBurnDamage: new Map(),
});

export const createInitialVisuals = (): VisualEffects => ({
  goldPopups: [],
  xpPopups: [],
  floatingTexts: [],
  damageNumbers: [],
  splashEffects: [],
  levelUpAnimations: [],
  upgradeAnimations: [],
  mergeAnimations: [],
  achievementQueue: [],
});

export const createInitialGameState = (): GameState => ({
  core: createInitialCoreState(),
  entities: createInitialEntityState(),
  tracking: createInitialTrackingState(),
  visuals: createInitialVisuals(),
});
