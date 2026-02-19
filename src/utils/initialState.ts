import type { ElementData } from "../types/GameState";
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
});

export const createInitialEntityState = (): EntityState => ({
  enemies: [],
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
});

export const createInitialGameState = (devMode: boolean = false): GameState => ({
  core: createInitialCoreState(devMode),
  entities: createInitialEntityState(),
  tracking: createInitialTrackingState(),
  visuals: createInitialVisuals(),
});
