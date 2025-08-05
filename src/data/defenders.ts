import { elements } from "./elements";
import type { ElementType } from "./elements";

export interface DefenderData {
  id: string;
  name: string;
  type: ElementType;
  damage: number;
  attackSpeed: number;
  range: number;
  cost: number;
  description: string;
}

export const defenders: DefenderData[] = [
  {
    id: "fire",
    name: "Fire Mage",
    type: "fire",
    damage: elements.fire.baseStats.damage,
    attackSpeed: elements.fire.baseStats.attackSpeed,
    range: elements.fire.baseStats.range,
    cost: 100,
    description: "Fire mage with burn abilities.",
  },
  {
    id: "ice",
    name: "Ice Mage",
    type: "ice",
    damage: elements.ice.baseStats.damage,
    attackSpeed: elements.ice.baseStats.attackSpeed,
    range: elements.ice.baseStats.range,
    cost: 100,
    description: "Ice mage with slow abilities.",
  },
  {
    id: "earth",
    name: "Earth Mage",
    type: "earth",
    damage: elements.earth.baseStats.damage,
    attackSpeed: elements.earth.baseStats.attackSpeed,
    range: elements.earth.baseStats.range,
    cost: 100,
    description: "Earth mage with splash damage.",
  },
  {
    id: "air",
    name: "Air Mage",
    type: "air",
    damage: elements.air.baseStats.damage,
    attackSpeed: elements.air.baseStats.attackSpeed,
    range: elements.air.baseStats.range,
    cost: 100,
    description: "Air mage with burst attack speed.",
  },
];

export const getDefenderData = (
  defenderType: ElementType
): DefenderData | undefined => {
  return defenders.find((defender) => defender.id === defenderType);
};

export const generateDefenderId = (): string => {
  return `defender_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
