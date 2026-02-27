import type { ElementType } from "../data/elements";
import type {
  Enemy,
  Defender,
  Arrow,
  ElementData,
  VortexData,
  GoldPopup,
  XpPopup,
  FloatingText,
  DamageNumber,
  SplashEffect,
  LevelUpAnimation,
  UpgradeAnimation,
  MageProgress,
  MergeAnimation,
} from "./GameState";

// Power-up system types
export interface PowerUpDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  duration: number; // 0 = instant, otherwise ms
  applyEffect: (state: GameState) => void;
  spawnWeight: number;
  resolveElementType?: (state: GameState) => ElementType; // For element-specific buffs
}

export interface ActivePowerUp {
  id: string;
  powerUpId: string;
  startTime: number;
  duration: number;
  elementType?: ElementType; // For element-specific buffs (e.g. Elemental Surge, Mentorship)
}

export interface SpawnedPowerUp {
  id: string;
  powerUpId: string;
  x: number;
  y: number;
  spawnTime: number;
  despawnTime: number;
}

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
  achievements: Record<string, number>; // id -> unlock timestamp (0 = locked)
  totalEnemiesKilled: number;
  totalGoldSpent: number;
  totalGoldEarned: number;
  totalMerges: number;
  totalPowerUpsCollected: number;
  collectedPowerUpTypes: string[];
  activePowerUps: ActivePowerUp[];
}

// Entity state - game objects
export interface EntityState {
  enemies: Enemy[];
  pendingEnemies: Enemy[]; // Enemies waiting to spawn (staggered wave spawning)
  defenders: Defender[];
  arrows: Arrow[];
  vortexes: VortexData[];
  spawnedPowerUp: SpawnedPowerUp | null;
}

// Tracking state - used for targeting logic
export interface TrackingState {
  predictedArrowDamage: Map<string, number>;
  predictedBurnDamage: Map<string, number>;
}

// Visual effects - ephemeral, NOT saved
export interface VisualEffects {
  goldPopups: GoldPopup[];
  xpPopups: XpPopup[];
  floatingTexts: FloatingText[];
  damageNumbers: DamageNumber[];
  splashEffects: SplashEffect[];
  levelUpAnimations: LevelUpAnimation[];
  upgradeAnimations: UpgradeAnimation[];
  mergeAnimations: MergeAnimation[];
  achievementQueue: string[]; // achievement IDs waiting to show popup
}

// Combined game state (what gets passed around)
export interface GameState {
  core: CoreState;
  entities: EntityState;
  tracking: TrackingState;
  visuals: VisualEffects;
}
