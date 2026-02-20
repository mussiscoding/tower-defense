import type { MageProgress, MageTier } from "../types/GameState";

const TIERS: MageTier[] = [
  "initiate",
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
const STARS_PER_TIER = 5;
const MAX_TOTAL_STARS = TIERS.length * STARS_PER_TIER; // 50

export const RANK_NAMES: Record<MageTier, string> = {
  initiate: "Initiate",
  apprentice: "Apprentice",
  journeyman: "Journeyman",
  adept: "Adept",
  mage: "Mage",
  sorcerer: "Sorcerer",
  magus: "Magus",
  archmage: "Archmage",
  grand_magus: "Grand Magus",
  archon: "Archon",
};

// 3 bronze gradients, 3 silver, 3 gold, 1 white
export const RANK_COLORS: Record<MageTier, string> = {
  initiate: "#8B6914",
  apprentice: "#CD7F32",
  journeyman: "#DAA520",
  adept: "#808090",
  mage: "#C0C0C0",
  sorcerer: "#E0E0E8",
  magus: "#B8860B",
  archmage: "#FFD700",
  grand_magus: "#FFE55C",
  archon: "#FFFFFF",
};

/**
 * Get total stars (1-50) from a MageProgress.
 */
export function getTotalStars(progress: MageProgress): number {
  const tierIndex = TIERS.indexOf(progress.tier);
  return tierIndex * STARS_PER_TIER + progress.stars;
}

/**
 * Convert a total star count (1-50) back to MageProgress.
 */
export function progressFromTotalStars(n: number): MageProgress {
  const clamped = Math.max(1, Math.min(MAX_TOTAL_STARS, n));
  const tierIndex = Math.floor((clamped - 1) / STARS_PER_TIER);
  const stars = clamped - tierIndex * STARS_PER_TIER;
  return { stars, tier: TIERS[tierIndex] };
}

/**
 * Advance star by 1, handling tier promotions.
 * Returns new MageProgress. Caps at archon 5.
 */
export function advanceStar(progress: MageProgress): MageProgress {
  const total = getTotalStars(progress);
  if (total >= MAX_TOTAL_STARS) return progress;
  return progressFromTotalStars(total + 1);
}

/**
 * Damage multiplier from stars: 3^(totalStars - 1).
 * 1 star = 1x, 2 stars = 3x, 3 stars = 9x, etc.
 */
export function getStarDamageMultiplier(progress: MageProgress): number {
  return Math.pow(3, getTotalStars(progress) - 1);
}

/**
 * Cost of next mage purchase: 100 * 3^(totalStars - 1).
 */
export function getNextMageCost(progress: MageProgress): number {
  return Math.floor(100 * Math.pow(3, getTotalStars(progress) - 1));
}

/**
 * Whether more stars can be purchased (false at archon 5).
 */
export function canPurchaseMoreStars(progress: MageProgress): boolean {
  return getTotalStars(progress) < MAX_TOTAL_STARS;
}

/**
 * Get display name for a rank.
 */
export function getRankName(tier: MageTier): string {
  return RANK_NAMES[tier];
}

/**
 * Get color for a rank.
 */
export function getRankColor(tier: MageTier): string {
  return RANK_COLORS[tier];
}

/**
 * Get the rank name for a given total star count.
 */
export function getNextRankName(totalStars: number): string {
  const next = progressFromTotalStars(totalStars);
  return RANK_NAMES[next.tier];
}
