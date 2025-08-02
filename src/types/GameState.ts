export interface Enemy {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  goldValue: number;
  type: "goblin" | "orc" | "troll";
}

export interface Defender {
  id: string;
  type: "archer" | "mage" | "trebuchet";
  x: number;
  y: number;
  damage: number;
  attackSpeed: number;
  range: number;
  lastAttack: number;
  level: number;
  cost: number;
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
  spawnRate: number;
  lastSave: number;
  isPaused: boolean;
  purchases: Record<string, number>; // Track number of each item purchased
  difficultyLevel: number; // 1-3: 1=goblins only, 2=goblins+orcs, 3=all types
  spawnRateLevel: number; // 1-5: Controls enemy spawn frequency
  predictedDamage: Map<string, number>; // Track predicted damage to enemies from arrows in flight
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
}

export interface GoldPopup {
  id: string;
  x: number;
  y: number;
  amount: number;
  startTime: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: "defender" | "upgrade" | "castle";
  effect: string;
  scalingFactor: number;
}
