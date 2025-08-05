import type { ShopItem } from "../types/GameState";
import { defenders } from "./defenders";
import { upgradeShopItems } from "./upgrades";

// Create shop items for defenders
const defenderShopItems: ShopItem[] = defenders.map((defender) => ({
  id: defender.id,
  name: defender.name,
  description: defender.description,
  cost: defender.cost,
  type: "defender" as const,
  effect: `Adds a ${defender.name.toLowerCase()} defender`,
  costScalingFactor: 2.0,
}));

export const shopItems: ShopItem[] = [
  ...defenderShopItems,
  ...upgradeShopItems,
];

export const getCurrentPrice = (
  item: ShopItem,
  purchases: Record<string, number>
): number => {
  const purchasedCount = purchases[item.id] || 0;
  return Math.floor(
    item.cost * Math.pow(item.costScalingFactor, purchasedCount)
  );
};
