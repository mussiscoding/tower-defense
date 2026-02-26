import type { GameState } from "../types/GameStateSlices";
import type { ElementType } from "./elements";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  category:
    | "start"
    | "progression"
    | "combat"
    | "wealth"
    | "difficulty"
    | "hidden";
  hidden: boolean;
  tieredGroup?: string;
  tieredOrder?: number;
  checkType: "state" | "event";
  check: (state: GameState) => boolean;
  getProgress?: (state: GameState) => { current: number; target: number };
}

const ELEMENT_TYPES: ElementType[] = ["fire", "ice", "earth", "air"];

const anyElementAtLevel = (state: GameState, level: number): boolean =>
  ELEMENT_TYPES.some((et) => state.core.elements[et]?.level >= level);

const maxElementLevel = (state: GameState): number =>
  Math.max(...ELEMENT_TYPES.map((et) => state.core.elements[et]?.level ?? 0));

export const achievements: AchievementDef[] = [
  // === Getting Started (4) ===
  {
    id: "first_kill",
    name: "First Blood",
    description: "Kill your first enemy",
    icon: "🗡️",
    reward: 50,
    category: "start",
    hidden: false,
    checkType: "state",
    check: (state) => state.core.totalEnemiesKilled >= 1,
    getProgress: (state) => ({
      current: Math.min(state.core.totalEnemiesKilled, 1),
      target: 1,
    }),
  },
  {
    id: "first_mage",
    name: "Apprentice Trainer",
    description: "Train your first mage",
    icon: "🧙",
    reward: 100,
    category: "start",
    hidden: false,
    checkType: "state",
    check: (state) => state.entities.defenders.length > 0,
  },
  {
    id: "all_elements",
    name: "Elemental Diversity",
    description: "Have all 4 element types on the field",
    icon: "🌈",
    reward: 200,
    category: "hidden",
    hidden: true,
    checkType: "state",
    check: (state) => {
      const types = new Set(state.entities.defenders.map((d) => d.type));
      return types.size >= 4;
    },
  },
  {
    id: "first_skill",
    name: "Upgrade Path",
    description: "Purchase your first skill",
    icon: "⬆️",
    reward: 100,
    category: "start",
    hidden: false,
    checkType: "state",
    check: (state) => {
      // Check if any skill ID is in purchases (skills have specific naming patterns)
      return Object.entries(state.core.purchases).some(
        ([key, val]) =>
          val > 0 &&
          key.includes("_") &&
          !ELEMENT_TYPES.includes(key as ElementType) &&
          key !== "click_damage_upgrade",
      );
    },
  },

  // === Progression (8) ===
  {
    id: "first_merge",
    name: "Rising Star",
    description: "Merge a mage for the first time",
    icon: "⭐",
    reward: 500,
    category: "progression",
    hidden: false,
    checkType: "state",
    check: (state) => state.core.totalMerges >= 1,
  },
  {
    id: "rank_apprentice",
    name: "Apprentice Rank",
    description: "Reach Apprentice rank on any element",
    icon: "🎓",
    reward: 5000,
    category: "progression",
    hidden: false,
    tieredGroup: "rank",
    tieredOrder: 1,
    checkType: "state",
    check: (state) => {
      const tiers = [
        "apprentice",
        "journeyman",
        "adept",
        "mage",
        "sorcerer",
        "magus",
        "archmage",
        "grand_magus",
        "archon",
      ];
      return ELEMENT_TYPES.some((et) =>
        tiers.includes(state.core.mageProgress[et]?.tier),
      );
    },
  },
  {
    id: "rank_journeyman",
    name: "Journeyman Rank",
    description: "Reach Journeyman rank on any element",
    icon: "🎓",
    reward: 5000000,
    category: "progression",
    hidden: false,
    tieredGroup: "rank",
    tieredOrder: 2,
    checkType: "state",
    check: (state) => {
      const tiers = [
        "journeyman",
        "adept",
        "mage",
        "sorcerer",
        "magus",
        "archmage",
        "grand_magus",
        "archon",
      ];
      return ELEMENT_TYPES.some((et) =>
        tiers.includes(state.core.mageProgress[et]?.tier),
      );
    },
  },
  {
    id: "rank_adept",
    name: "Adept Rank",
    description: "Reach Adept rank on any element",
    icon: "🎓",
    reward: 2500000000,
    category: "progression",
    hidden: false,
    tieredGroup: "rank",
    tieredOrder: 3,
    checkType: "state",
    check: (state) => {
      const tiers = [
        "adept",
        "mage",
        "sorcerer",
        "magus",
        "archmage",
        "grand_magus",
        "archon",
      ];
      return ELEMENT_TYPES.some((et) =>
        tiers.includes(state.core.mageProgress[et]?.tier),
      );
    },
  },
  {
    id: "rank_mage",
    name: "Master Mage",
    description: "Reach Mage rank on any element",
    icon: "🎓",
    reward: 100000,
    category: "progression",
    hidden: false,
    tieredGroup: "rank",
    tieredOrder: 4,
    checkType: "state",
    check: (state) => {
      const tiers = [
        "mage",
        "sorcerer",
        "magus",
        "archmage",
        "grand_magus",
        "archon",
      ];
      return ELEMENT_TYPES.some((et) =>
        tiers.includes(state.core.mageProgress[et]?.tier),
      );
    },
  },
  {
    id: "level_10",
    name: "Scholar",
    description: "Reach element level 10",
    icon: "📖",
    reward: 500,
    category: "progression",
    hidden: false,
    tieredGroup: "level",
    tieredOrder: 1,
    checkType: "state",
    check: (state) => anyElementAtLevel(state, 10),
    getProgress: (state) => ({
      current: Math.min(maxElementLevel(state), 10),
      target: 10,
    }),
  },
  {
    id: "level_25",
    name: "Professor",
    description: "Reach element level 25",
    icon: "📖",
    reward: 2500,
    category: "progression",
    hidden: false,
    tieredGroup: "level",
    tieredOrder: 2,
    checkType: "state",
    check: (state) => anyElementAtLevel(state, 25),
    getProgress: (state) => ({
      current: Math.min(maxElementLevel(state), 25),
      target: 25,
    }),
  },
  {
    id: "level_50",
    name: "Sage",
    description: "Reach element level 50",
    icon: "📖",
    reward: 10000,
    category: "progression",
    hidden: false,
    tieredGroup: "level",
    tieredOrder: 3,
    checkType: "state",
    check: (state) => anyElementAtLevel(state, 50),
    getProgress: (state) => ({
      current: Math.min(maxElementLevel(state), 50),
      target: 50,
    }),
  },

  // === Combat (8) ===
  {
    id: "kills_100",
    name: "Century",
    description: "Kill 100 enemies",
    icon: "💀",
    reward: 200,
    category: "combat",
    hidden: false,
    tieredGroup: "kills",
    tieredOrder: 1,
    checkType: "state",
    check: (state) => state.core.totalEnemiesKilled >= 100,
    getProgress: (state) => ({
      current: Math.min(state.core.totalEnemiesKilled, 100),
      target: 100,
    }),
  },
  {
    id: "kills_1000",
    name: "Slayer",
    description: "Kill 1,000 enemies",
    icon: "💀",
    reward: 10000,
    category: "combat",
    hidden: false,
    tieredGroup: "kills",
    tieredOrder: 2,
    checkType: "state",
    check: (state) => state.core.totalEnemiesKilled >= 1000,
    getProgress: (state) => ({
      current: Math.min(state.core.totalEnemiesKilled, 1000),
      target: 1000,
    }),
  },
  {
    id: "kills_10000",
    name: "Exterminator",
    description: "Kill 10,000 enemies",
    icon: "💀",
    reward: 5000,
    category: "combat",
    hidden: false,
    tieredGroup: "kills",
    tieredOrder: 3,
    checkType: "state",
    check: (state) => state.core.totalEnemiesKilled >= 10000,
    getProgress: (state) => ({
      current: Math.min(state.core.totalEnemiesKilled, 10000),
      target: 10000,
    }),
  },
  {
    id: "giant_killer",
    name: "Giant Killer",
    description: "Kill a giant enemy",
    icon: "👹",
    reward: 500,
    category: "combat",
    hidden: false,
    checkType: "event",
    check: () => true,
  },
  {
    id: "burn_kill",
    name: "Burn Notice",
    description: "Kill an enemy with burn damage",
    icon: "🔥",
    reward: 200,
    category: "combat",
    hidden: false,
    checkType: "event",
    check: () => true,
  },
  {
    id: "slow_kill",
    name: "Shattered",
    description: "Kill a slowed enemy",
    icon: "❄️",
    reward: 200,
    category: "combat",
    hidden: false,
    checkType: "event",
    check: () => true,
  },
  {
    id: "splash_multi",
    name: "Splash Zone",
    description: "Hit 3+ enemies with one splash",
    icon: "💥",
    reward: 300,
    category: "combat",
    hidden: false,
    checkType: "event",
    check: () => true,
  },
  {
    id: "critical_hit",
    name: "Critical Strike",
    description: "Land a critical hit",
    icon: "⚡",
    reward: 2000,
    category: "combat",
    hidden: false,
    checkType: "event",
    check: () => true,
  },

  // === Wealth (7) ===
  {
    id: "earned_1000",
    name: "Breadwinner",
    description: "Earn 1,000 gold total",
    icon: "🪙",
    reward: 100,
    category: "wealth",
    hidden: false,
    tieredGroup: "earned",
    tieredOrder: 1,
    checkType: "state",
    check: (state) => state.core.totalGoldEarned >= 1000,
    getProgress: (state) => ({
      current: Math.min(state.core.totalGoldEarned, 1000),
      target: 1000,
    }),
  },
  {
    id: "earned_10000",
    name: "Prosperous",
    description: "Earn 10,000 gold total",
    icon: "🪙",
    reward: 300,
    category: "wealth",
    hidden: false,
    tieredGroup: "earned",
    tieredOrder: 2,
    checkType: "state",
    check: (state) => state.core.totalGoldEarned >= 10000,
    getProgress: (state) => ({
      current: Math.min(state.core.totalGoldEarned, 10000),
      target: 10000,
    }),
  },
  {
    id: "earned_100000",
    name: "Golden Touch",
    description: "Earn 100,000 gold total",
    icon: "🪙",
    reward: 1000,
    category: "wealth",
    hidden: false,
    tieredGroup: "earned",
    tieredOrder: 3,
    checkType: "state",
    check: (state) => state.core.totalGoldEarned >= 100000,
    getProgress: (state) => ({
      current: Math.min(state.core.totalGoldEarned, 100000),
      target: 100000,
    }),
  },
  {
    id: "gold_1000",
    name: "Savings Account",
    description: "Hold 1,000 gold at once",
    icon: "💰",
    reward: 200,
    category: "wealth",
    hidden: false,
    tieredGroup: "gold",
    tieredOrder: 1,
    checkType: "state",
    check: (state) => state.core.gold >= 1000,
    getProgress: (state) => ({
      current: Math.min(state.core.gold, 1000),
      target: 1000,
    }),
  },
  {
    id: "gold_10000",
    name: "Rich",
    description: "Hold 10,000 gold at once",
    icon: "💰",
    reward: 500,
    category: "wealth",
    hidden: false,
    tieredGroup: "gold",
    tieredOrder: 2,
    checkType: "state",
    check: (state) => state.core.gold >= 10000,
    getProgress: (state) => ({
      current: Math.min(state.core.gold, 10000),
      target: 10000,
    }),
  },
  {
    id: "gold_100000",
    name: "Wealthy",
    description: "Hold 100,000 gold at once",
    icon: "💰",
    reward: 2000,
    category: "wealth",
    hidden: false,
    tieredGroup: "gold",
    tieredOrder: 3,
    checkType: "state",
    check: (state) => state.core.gold >= 100000,
    getProgress: (state) => ({
      current: Math.min(state.core.gold, 100000),
      target: 100000,
    }),
  },
  {
    id: "spend_10000",
    name: "Big Spender",
    description: "Spend 10,000 gold total",
    icon: "🛒",
    reward: 1000,
    category: "wealth",
    hidden: false,
    checkType: "state",
    check: (state) => state.core.totalGoldSpent >= 10000,
    getProgress: (state) => ({
      current: Math.min(state.core.totalGoldSpent, 10000),
      target: 10000,
    }),
  },

  // === Difficulty & Survival (5) ===
  {
    id: "diff_5",
    name: "Brave",
    description: "Reach difficulty 5",
    icon: "🛡️",
    reward: 500,
    category: "difficulty",
    hidden: false,
    tieredGroup: "diff",
    tieredOrder: 1,
    checkType: "state",
    check: (state) => state.core.difficultyLevel >= 5,
    getProgress: (state) => ({
      current: Math.min(state.core.difficultyLevel, 5),
      target: 5,
    }),
  },
  {
    id: "diff_10",
    name: "Fearless",
    description: "Reach difficulty 10",
    icon: "🛡️",
    reward: 2000,
    category: "difficulty",
    hidden: false,
    tieredGroup: "diff",
    tieredOrder: 2,
    checkType: "state",
    check: (state) => state.core.difficultyLevel >= 10,
    getProgress: (state) => ({
      current: Math.min(state.core.difficultyLevel, 10),
      target: 10,
    }),
  },
  {
    id: "diff_50",
    name: "Legendary",
    description: "Reach difficulty 50",
    icon: "🛡️",
    reward: 1000000,
    category: "difficulty",
    hidden: false,
    tieredGroup: "diff",
    tieredOrder: 3,
    checkType: "state",
    check: (state) => state.core.difficultyLevel >= 50,
    getProgress: (state) => ({
      current: Math.min(state.core.difficultyLevel, 50),
      target: 50,
    }),
  },
  {
    id: "survive_10m",
    name: "Survivor",
    description: "Survive 10 minutes",
    icon: "⏰",
    reward: 300,
    category: "difficulty",
    hidden: false,
    tieredGroup: "survive",
    tieredOrder: 1,
    checkType: "state",
    check: (state) => state.core.timeSurvived >= 600,
    getProgress: (state) => ({
      current: Math.min(state.core.timeSurvived, 600),
      target: 600,
    }),
  },
  {
    id: "survive_30m",
    name: "Enduring",
    description: "Survive 30 minutes",
    icon: "⏰",
    reward: 1000,
    category: "difficulty",
    hidden: false,
    tieredGroup: "survive",
    tieredOrder: 2,
    checkType: "state",
    check: (state) => state.core.timeSurvived >= 1800,
    getProgress: (state) => ({
      current: Math.min(state.core.timeSurvived, 1800),
      target: 1800,
    }),
  },

  // === Hidden (3) ===
  {
    id: "overkill",
    name: "Overkill",
    description: "Deal 100x an enemy's max HP in one hit",
    icon: "💣",
    reward: 500,
    category: "hidden",
    hidden: true,
    checkType: "event",
    check: () => true,
  },
  {
    id: "stats_man",
    name: "Stats Man",
    description: "Check the stats page",
    icon: "📊",
    reward: 100,
    category: "hidden",
    hidden: true,
    checkType: "event",
    check: () => true,
  },
  {
    id: "fully_loaded",
    name: "Fully Loaded",
    description: "Have 8 mages on the board at once",
    icon: "🏰",
    reward: 500,
    category: "hidden",
    hidden: true,
    checkType: "state",
    check: (state) => state.entities.defenders.length >= 8,
  },
];

// Map for fast lookup by ID
export const achievementMap: Record<string, AchievementDef> = {};
achievements.forEach((a) => {
  achievementMap[a.id] = a;
});

// Pre-filtered list of state-based achievements
export const stateAchievements = achievements.filter(
  (a) => a.checkType === "state",
);
