import type { ElementType } from "../data/elements";

export type MageTier =
  | "initiate"
  | "apprentice"
  | "journeyman"
  | "adept"
  | "mage"
  | "sorcerer"
  | "magus"
  | "archmage"
  | "grand_magus"
  | "archon";

export interface MageProgress {
  stars: number;
  tier: MageTier;
}

export interface MergeAnimation {
  id: string;
  elementType: ElementType;
  fromPositions: { x: number; y: number }[];
  toPosition: { x: number; y: number };
  startTime: number;
  duration: number;
  resultStars: number;
  resultTier: MageTier;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  goldValue: number;
  colorIndex: number; // Add color index for shirt color variations
  isGiant?: boolean; // Giant enemies are 2x size
  spawnTime?: number; // When this enemy should spawn (for pending enemies)
  burnDamage?: number;
  burnEndTime?: number;
  slowEffect?: number;
  slowEndTime?: number;
  vortexEffect?: {
    vortexId: string;
    pullDirectionX: number;
    pullDirectionY: number;
    pullStrength: number;
    endTime: number;
  };
}

export interface Defender {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  damage: number;
  attackSpeed: number;
  range: number;
  lastAttack: number;
  level: number;
  cost: number;
  currentAnimationFrame?: number; // Current animation frame (1-7)
  skillCooldowns?: Record<string, number>; // skill_id -> end_time mapping for active cooldowns
}

export interface ElementBaseStats {
  damage: number;
  attackSpeed: number;
  range: number;
}

export interface ElementAbilities {
  burnDamagePercent?: number;
  burnDuration?: number;
  slowEffect?: number;
  slowDuration?: number;
  splashDamage?: number;
  splashRadius?: number;
  burstShots?: number;
  burstCooldown?: number;
}

export interface ElementData {
  level: number;
  xp: number;
  totalDamage: number;
  baseStats: ElementBaseStats;
  abilities: ElementAbilities;
}

export interface LevelUpAnimation {
  id: string;
  elementType: ElementType;
  x: number;
  y: number;
  startTime: number;
  duration: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  startTime: number;
  duration: number;
  color: string;
  elementType: ElementType;
}

export interface UpgradeAnimation {
  id: string;
  shortName: string;
  startTime: number;
  duration: number;
  elementType: ElementType;
  mageX: number;
  mageY: number;
}

export interface DamageNumber {
  id: string;
  damage: number;
  x: number;
  y: number;
  elementType: ElementType;
  startTime: number;
  isCritical?: boolean;
}

export interface GameState {
  gold: number;
  castleHealth: number;
  timeSurvived: number;
  clickDamage: number;
  defenders: Defender[];
  enemies: Enemy[];
  arrows: Arrow[];
  goldPopups: GoldPopup[];
  splashEffects: SplashEffect[];
  vortexes: VortexData[]; // Active vortex effects
  levelUpAnimations: LevelUpAnimation[];
  floatingTexts: FloatingText[];
  upgradeAnimations: UpgradeAnimation[];
  damageNumbers: DamageNumber[];
  lastSave: number;
  isPaused: boolean;
  purchases: Record<string, number>;
  difficultyLevel: number; // 1-10000, controls wave intensity and unlocks enemy types
  predictedArrowDamage: Map<string, number>;
  predictedBurnDamage: Map<string, number>;
  elements: Record<ElementType, ElementData>;
}

export interface Arrow {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
  duration: number; // milliseconds
  targetEnemyId?: string; // Optional target enemy ID for precise targeting
  elementType: ElementType; // Element type of the defender that fired this arrow
  onHitEffects?: Skill[]; // Skills that should trigger when this arrow hits
}

export interface GoldPopup {
  id: string;
  x: number;
  y: number;
  amount: number;
  startTime: number;
}

export interface XpPopup {
  id: string;
  x: number;
  y: number;
  amount: number;
  startTime: number;
}

export interface SplashEffect {
  id: string;
  centerX: number;
  centerY: number;
  radius: number;
  startTime: number;
  duration: number; // milliseconds
}

export interface VortexData {
  id: string;
  centerX: number;
  centerY: number;
  radius: number;
  pullStrength: number;
  startTime: number;
  duration: number;
  affectedEnemyIds: Set<string>;
}

export interface BonusDamage {
  amount: number;
  x: number;
  y: number;
  elementType: ElementType;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: "defender" | "upgrade" | "castle";
  costScalingFactor: number;
  shortName?: string;
}

export type SkillState =
  | "locked"
  | "purchaseable"
  | "insufficient_gold"
  | "purchased";

export interface SkillUnlockRequirement {
  [elementType: string]: number; // e.g., { fire: 25, ice: 25 }
}

export type SkillCategory = "attack_modifier" | "active" | "spell";

// Minimal context object for skill handlers - only what they actually need
export interface SkillContext {
  purchases: Record<string, number>;
  enemies: Enemy[];
  arrows: Arrow[]; // For skills that create arrows
  elements: Record<ElementType, ElementData>;
  splashEffects: SplashEffect[]; // For skills that create splash effects
  vortexes: VortexData[]; // For skills that create vortex effects
  bonusDamage: BonusDamage[];
  achievementEvents?: {
    criticalHitLanded?: boolean;
    splashHitCounts?: number[];
  };
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlockRequirements: SkillUnlockRequirement;
  icon: string; // 1-10 for now, real icons later
  category: SkillCategory;
  priority?: number; // For actives - higher priority casts first
  cooldown?: number; // For actives and spells - milliseconds
  cooldownUpgradeId?: string; // ID of upgrade that reduces this skill's cooldown

  // UI display properties - for showing skill stats in Mages component
  statName?: string; // e.g. "Burn Damage", "Slow Effect", "Splash Radius"
  statValue?:
    | string
    | number
    | ((purchases: Record<string, number>) => string | number); // Static value or function to calculate based on purchases

  // Event handlers - optional, only implement what the skill needs
  onAttack?: (defender: Defender, target: Enemy, context: SkillContext) => void;
  onHit?: (enemy: Enemy, damage: number, context: SkillContext) => void;
  onEnemyDeath?: (enemy: Enemy, killer: Arrow, context: SkillContext) => void;
  canCast?: (defender: Defender, context: SkillContext) => boolean;
}
