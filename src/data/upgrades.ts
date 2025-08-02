import type { ShopItem } from "../types/GameState";

export const upgradeShopItems: ShopItem[] = [
  {
    id: "click_damage_upgrade",
    name: "Click Damage +1",
    description: "Increase your click damage by 1",
    cost: 25,
    type: "upgrade",
    effect: "Increases click damage",
    scalingFactor: 1.2,
  },
  {
    id: "archer_damage_upgrade",
    name: "Archer Damage +1",
    description: "Increase all archer damage by 1",
    cost: 500,
    type: "upgrade",
    effect: "Increases archer damage",
    scalingFactor: 1.25,
  },
  {
    id: "archer_speed_upgrade",
    name: "Archer Speed +0.5",
    description: "Increase all archer attack speed by 0.5",
    cost: 1000,
    type: "upgrade",
    effect: "Increases archer attack speed",
    scalingFactor: 1.3,
  },
];
