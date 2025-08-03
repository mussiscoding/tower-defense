import type { ElementType } from "../data/elements";

export interface Enemy {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  goldValue: number;
  type: "goblin" | "orc" | "troll";
  burnDamage?: number;
  burnEndTime?: number;
  slowEffect?: number;
  slowEndTime?: number;
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
  burstCooldownEnd?: number; // When burst cooldown ends
}

export interface ElementBaseStats {
  damage: number;
  attackSpeed: number;
  range: number;
}

export interface ElementAbilities {
  burnDamage?: number;
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
  spawnRate: number;
  lastSave: number;
  isPaused: boolean;
  purchases: Record<string, number>;
  difficultyLevel: number;
  spawnRateLevel: number;
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
}

export interface GoldPopup {
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

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: "defender" | "upgrade" | "castle";
  costScalingFactor: number;
}
