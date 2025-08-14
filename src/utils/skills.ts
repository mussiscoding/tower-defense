import type { Skill } from "../types/GameState";
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

export const calculateCooldownValue = (
  baseValue: number,
  cooldownUpgradeId: string,
  purchases: Record<string, number>,
  minNumber?: number
): number => {
  const upgrades = purchases[cooldownUpgradeId] || 0;
  const upgradeAmount = getUpgradeAmount(cooldownUpgradeId);
  const totalValue = baseValue - upgrades * upgradeAmount;
  return minNumber ? Math.max(minNumber, totalValue) : totalValue;
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
