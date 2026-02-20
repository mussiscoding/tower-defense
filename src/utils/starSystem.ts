import type { MageProgress, MageTier } from "../types/GameState";

const TIERS: MageTier[] = ["bronze", "silver", "gold"];
const STARS_PER_TIER = 5;

/**
 * Get total stars (1-15) from a MageProgress.
 * bronze 1 = 1, bronze 5 = 5, silver 1 = 6, gold 5 = 15.
 */
export function getTotalStars(progress: MageProgress): number {
  const tierIndex = TIERS.indexOf(progress.tier);
  return tierIndex * STARS_PER_TIER + progress.stars;
}

/**
 * Convert a total star count (1-15) back to MageProgress.
 */
export function progressFromTotalStars(n: number): MageProgress {
  const clamped = Math.max(1, Math.min(15, n));
  const tierIndex = Math.floor((clamped - 1) / STARS_PER_TIER);
  const stars = clamped - tierIndex * STARS_PER_TIER;
  return { stars, tier: TIERS[tierIndex] };
}

/**
 * Advance star by 1, handling tier promotions.
 * Returns new MageProgress. Caps at gold 5.
 */
export function advanceStar(progress: MageProgress): MageProgress {
  const total = getTotalStars(progress);
  if (total >= 15) return progress;
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
 * Whether more stars can be purchased (false at gold 5).
 */
export function canPurchaseMoreStars(progress: MageProgress): boolean {
  return getTotalStars(progress) < 15;
}
