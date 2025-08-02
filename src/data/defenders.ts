export interface DefenderData {
  id: string;
  name: string;
  type: "archer" | "mage" | "trebuchet";
  damage: number;
  attackSpeed: number;
  range: number;
  cost: number;
  description: string;
}

export const defenders: DefenderData[] = [
  {
    id: "archer",
    name: "Archer",
    type: "archer",
    damage: 1,
    attackSpeed: 1, // attacks per second
    range: 500,
    cost: 50,
    description: "Basic ranged defender. Attacks nearest enemy.",
  },
  {
    id: "mage",
    name: "Mage",
    type: "mage",
    damage: 2,
    attackSpeed: 0.8, // attacks per second
    range: 400,
    cost: 100,
    description: "Powerful magic user with area damage.",
  },
  {
    id: "trebuchet",
    name: "Trebuchet",
    type: "trebuchet",
    damage: 5,
    attackSpeed: 0.3, // attacks per second
    range: 600,
    cost: 200,
    description: "Heavy siege weapon with massive damage.",
  },
];

export const getDefenderData = (
  defenderType: string
): DefenderData | undefined => {
  return defenders.find((defender) => defender.id === defenderType);
};

export const generateDefenderId = (): string => {
  return `defender_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
