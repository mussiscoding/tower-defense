import type { ElementType } from "../data/elements";
import type {
  Enemy,
  Defender,
  Arrow,
  ElementData,
  VortexData,
  GoldPopup,
  FloatingText,
  DamageNumber,
  SplashEffect,
  LevelUpAnimation,
  UpgradeAnimation,
} from "./GameState";

// Core game state - persistent, saved
export interface CoreState {
  gold: number;
  castleHealth: number;
  timeSurvived: number;
  clickDamage: number;
  difficultyLevel: number;
  isPaused: boolean;
  lastSave: number;
  purchases: Record<string, number>;
  elements: Record<ElementType, ElementData>;
}

// Entity state - game objects
export interface EntityState {
  enemies: Enemy[];
  defenders: Defender[];
  arrows: Arrow[];
  vortexes: VortexData[];
}

// Tracking state - used for targeting logic
export interface TrackingState {
  predictedArrowDamage: Map<string, number>;
  predictedBurnDamage: Map<string, number>;
}

// Visual effects - ephemeral, NOT saved
export interface VisualEffects {
  goldPopups: GoldPopup[];
  floatingTexts: FloatingText[];
  damageNumbers: DamageNumber[];
  splashEffects: SplashEffect[];
  levelUpAnimations: LevelUpAnimation[];
  upgradeAnimations: UpgradeAnimation[];
}

// Combined game state (what gets passed around)
export interface GameState {
  core: CoreState;
  entities: EntityState;
  tracking: TrackingState;
  visuals: VisualEffects;
}
