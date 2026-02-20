import type { ShopItem } from "../types/GameState";
import { allUpgrades } from "./upgrades";

export const shopItems: ShopItem[] = [...allUpgrades];

export const getCurrentPrice = (
  item: ShopItem,
  purchases: Record<string, number>
): number => {
  const purchasedCount = purchases[item.id] || 0;
  return Math.floor(
    item.cost * Math.pow(item.costScalingFactor, purchasedCount)
  );
};
