import type {
  Skill,
  Enemy,
  Defender,
  SkillContext,
  SkillCategory,
} from "../types/GameState";
import type { ElementType } from "../data/elements";
import { allUpgrades } from "../data/upgrades";
import { allSkills } from "../data/allSkills";

// Helper function to get upgrade amount for a specific upgrade
const getUpgradeAmount = (upgradeId: string): number => {
  const upgrade = allUpgrades.find((item) => item.id === upgradeId);
  return upgrade?.upgradeAmount || 1; // fallback to 1 if not found
};

// Helper function to calculate skill values - shared between UI and effects
export const calculateSkillValue = (
  baseValue: number,
  upgradeId: string | undefined,
  purchases: Record<string, number>,
  maxValue?: number
): number => {
  if (!upgradeId) {
    return baseValue;
  }

  const upgrades = purchases[upgradeId] || 0;
  const upgradeAmount = getUpgradeAmount(upgradeId);
  const totalValue = baseValue + upgrades * upgradeAmount;

  return maxValue ? Math.min(maxValue, totalValue) : totalValue;
};

// Helper function to create skills with dynamic stats and centralized base values
export const createSkill = (config: {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlockRequirements: Record<string, number>;
  icon: string;
  category: SkillCategory;
  statName?: string;
  baseValue?: number;
  upgradeId?: string;
  unit?: string;
  maxValue?: number;
  priority?: number;
  cooldown?: number;
  onHit?: (enemy: Enemy, damage: number, context: SkillContext) => void;
  onAttack?: (defender: Defender, target: Enemy, context: SkillContext) => void;
}): Skill => {
  const skill: Skill = {
    id: config.id,
    name: config.name,
    description: config.description,
    cost: config.cost,
    unlockRequirements: config.unlockRequirements,
    icon: config.icon,
    category: config.category,
  };

  // Add optional fields
  if (config.priority !== undefined) skill.priority = config.priority;
  if (config.cooldown !== undefined) skill.cooldown = config.cooldown;
  if (config.onHit) skill.onHit = config.onHit;
  if (config.onAttack) skill.onAttack = config.onAttack;

  // Add dynamic stat calculation if base value is provided
  if (config.statName && config.baseValue !== undefined) {
    skill.statName = config.statName;

    if (config.upgradeId) {
      // Dynamic stat value with upgrades
      skill.statValue = (purchases: Record<string, number>) => {
        const finalValue = calculateSkillValue(
          config.baseValue!,
          config.upgradeId!,
          purchases,
          config.maxValue
        );
        return `${finalValue}${config.unit || "%"}`;
      };
    } else {
      // Static stat value
      skill.statValue = `${config.baseValue}${config.unit || "%"}`;
    }
  }

  return skill;
};

// Helper functions for working with skills
export const getSkillsForElement = (elementType: ElementType): Skill[] => {
  return allSkills.filter(
    (skill) => skill.unlockRequirements[elementType] !== undefined
  );
};

export const getSkillById = (skillId: string): Skill | undefined => {
  return allSkills.find((skill) => skill.id === skillId);
};

export const getAllSkills = (): Skill[] => {
  return allSkills;
};

export const getSynergySkills = (): Skill[] => {
  return allSkills.filter(
    (skill) => Object.keys(skill.unlockRequirements).length > 1
  );
};

export const getSingleElementSkills = (): Skill[] => {
  return allSkills.filter(
    (skill) => Object.keys(skill.unlockRequirements).length === 1
  );
};
