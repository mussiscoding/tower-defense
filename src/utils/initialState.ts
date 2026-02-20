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
    {} as Record<ElementType, ElementData>
  );
};

export const createInitialMageProgress = (): Record<ElementType, MageProgress> => {
  return getAvailableElements().reduce(
    (acc, elementType) => {
      acc[elementType] = { stars: 1, tier: "initiate" };
      return acc;
    },
    {} as Record<ElementType, MageProgress>
  );
};

export const createInitialCoreState = (devMode: boolean = false): CoreState => ({
  gold: devMode ? 500 : 0,
  castleHealth: 100,
  timeSurvived: 0,
  clickDamage: 1,
  difficultyLevel: 1,
  isPaused: false,
  lastSave: Date.now(),
  purchases: {},
  elements: createInitialElements(),
  mageProgress: createInitialMageProgress(),
});

export const createInitialEntityState = (): EntityState => ({
  enemies: [],
  pendingEnemies: [],
  defenders: [],
  arrows: [],
  vortexes: [],
});

export const createInitialTrackingState = (): TrackingState => ({
  predictedArrowDamage: new Map(),
  predictedBurnDamage: new Map(),
});

export const createInitialVisuals = (): VisualEffects => ({
  goldPopups: [],
  floatingTexts: [],
  damageNumbers: [],
  splashEffects: [],
  levelUpAnimations: [],
  upgradeAnimations: [],
  mergeAnimations: [],
});

export const createInitialGameState = (devMode: boolean = false): GameState => ({
  core: createInitialCoreState(devMode),
  entities: createInitialEntityState(),
  tracking: createInitialTrackingState(),
  visuals: createInitialVisuals(),
});
