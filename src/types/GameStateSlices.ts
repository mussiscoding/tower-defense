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
  MageProgress,
  MergeAnimation,
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
  mageProgress: Record<ElementType, MageProgress>;
}

// Entity state - game objects
export interface EntityState {
  enemies: Enemy[];
  pendingEnemies: Enemy[]; // Enemies waiting to spawn (staggered wave spawning)
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
  mergeAnimations: MergeAnimation[];
}

// Combined game state (what gets passed around)
export interface GameState {
  core: CoreState;
  entities: EntityState;
  tracking: TrackingState;
  visuals: VisualEffects;
}
