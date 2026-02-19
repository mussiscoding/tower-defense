import type { GameState, ElementData } from "../types/GameState";
import { getAvailableElements, createInitialElementData } from "../data/elements";

export const createInitialGameState = (devMode: boolean = false): GameState => ({
  gold: devMode ? 500 : 0,
  castleHealth: 100,
  timeSurvived: 0,
  clickDamage: 1,
  defenders: [],
  enemies: [],
  arrows: [],
  goldPopups: [],
  splashEffects: [],
  levelUpAnimations: [],
  floatingTexts: [],
  upgradeAnimations: [],
  damageNumbers: [],
  vortexes: [],
  lastSave: Date.now(),
  isPaused: false,
  purchases: {},
  difficultyLevel: 1,
  predictedArrowDamage: new Map(),
  predictedBurnDamage: new Map(),
  elements: getAvailableElements().reduce(
    (acc, elementType) => {
      acc[elementType] = createInitialElementData(elementType);
      return acc;
    },
    {} as Record<string, ElementData>
  ),
});
