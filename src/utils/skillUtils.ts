import type {
  GameState,
  Skill,
  SkillState,
  SkillCategory,
  Defender,
  SkillContext,
} from "../types/GameState";
import type { ElementType } from "../data/elements";
import { getSkillsForElement, getSkillById, allSkills } from "../data/skills";

/**
 * Check if unlock requirements are met for a skill
 */
export const areUnlockRequirementsMet = (
  skill: Skill,
  elements: Record<ElementType, { level: number }>
): boolean => {
  for (const [elementType, requiredLevel] of Object.entries(
    skill.unlockRequirements
  )) {
    const element = elements[elementType as ElementType];
    if (!element || element.level < requiredLevel) {
      return false;
    }
  }
  return true;
};

/**
 * Get the current state of a skill for the player
 */
export const getSkillState = (
  skill: Skill,
  elements: Record<ElementType, { level: number }>,
  playerGold: number,
  purchases: Record<string, number>
): SkillState => {
  // Check if already purchased
  if (purchases[skill.id] && purchases[skill.id] > 0) {
    return "purchased";
  }

  // Check if unlock requirements are met
  if (!areUnlockRequirementsMet(skill, elements)) {
    return "locked";
  }

  // Check if player has enough gold
  if (playerGold < skill.cost) {
    return "insufficient_gold";
  }

  // All requirements met
  return "purchaseable";
};

/**
 * Check if a skill can be purchased
 */
export const canPurchaseSkill = (
  skill: Skill,
  elements: Record<ElementType, { level: number }>,
  playerGold: number,
  purchases: Record<string, number>
): boolean => {
  return (
    getSkillState(skill, elements, playerGold, purchases) === "purchaseable"
  );
};

/**
 * Get all skills for an element with their current states
 */
export const getSkillStatesForElement = (
  elementType: ElementType,
  elements: Record<ElementType, { level: number }>,
  playerGold: number,
  purchases: Record<string, number>
): Array<{ skill: Skill; state: SkillState }> => {
  const skills = getSkillsForElement(elementType);
  return skills.map((skill) => ({
    skill,
    state: getSkillState(skill, elements, playerGold, purchases),
  }));
};

/**
 * Check if a skill is purchased
 */
export const isSkillPurchased = (
  skillId: string,
  purchases: Record<string, number>
): boolean => {
  return !!(purchases[skillId] && purchases[skillId] > 0);
};

/**
 * Get all purchased skills for an element
 */
export const getPurchasedSkillsForElement = (
  elementType: ElementType,
  purchases: Record<string, number>
): Skill[] => {
  const skills = getSkillsForElement(elementType);
  return skills.filter((skill) => isSkillPurchased(skill.id, purchases));
};

/**
 * Get all purchased skills across all elements
 */
export const getAllPurchasedSkills = (
  purchases: Record<string, number>
): Skill[] => {
  const allSkills: Skill[] = [];
  const elementTypes: ElementType[] = ["fire", "ice", "earth", "air"];

  for (const elementType of elementTypes) {
    const purchasedSkills = getPurchasedSkillsForElement(
      elementType,
      purchases
    );
    allSkills.push(...purchasedSkills);
  }

  return allSkills;
};

/**
 * Purchase a skill and update game state
 */
export const purchaseSkill = (state: GameState, skillId: string): GameState => {
  const skill = getSkillById(skillId);
  if (!skill) {
    console.error(`Skill not found: ${skillId}`);
    return state;
  }

  // Validate purchase
  if (!canPurchaseSkill(skill, state.elements, state.gold, state.purchases)) {
    console.error(`Cannot purchase skill: ${skillId}`);
    return state;
  }

  // Update purchases and deduct gold
  return {
    ...state,
    gold: state.gold - skill.cost,
    purchases: {
      ...state.purchases,
      [skillId]: 1, // Skills are one-time purchases
    },
  };
};

/**
 * Get missing requirements for a skill
 */
export const getMissingRequirements = (
  skill: Skill,
  elements: Record<ElementType, { level: number }>
): Partial<Record<ElementType, number>> => {
  const missing: Partial<Record<ElementType, number>> = {};

  for (const [elementType, requiredLevel] of Object.entries(
    skill.unlockRequirements
  )) {
    const element = elements[elementType as ElementType];
    const currentLevel = element?.level || 0;

    if (currentLevel < requiredLevel) {
      missing[elementType as ElementType] = requiredLevel - currentLevel;
    }
  }

  return missing;
};

/**
 * Get the next skill that can be unlocked for an element
 */
export const getNextUnlockableSkill = (
  elementType: ElementType,
  purchases: Record<string, number>
): Skill | null => {
  const skills = getSkillsForElement(elementType);

  // Filter out purchased skills and sort by requirements
  const availableSkills = skills
    .filter((skill) => !isSkillPurchased(skill.id, purchases))
    .sort((a, b) => {
      const aLevel = a.unlockRequirements[elementType] || 0;
      const bLevel = b.unlockRequirements[elementType] || 0;
      return aLevel - bLevel;
    });

  return availableSkills[0] || null;
};

/**
 * Get active skills for an element, optionally filtered by category
 */
export const getActiveSkillsForElement = (
  elementType: ElementType,
  purchases: Record<string, number>,
  category?: SkillCategory
): Skill[] => {
  const elementSkills = getSkillsForElement(elementType);

  return elementSkills.filter((skill) => {
    // Must be purchased
    if (!isSkillPurchased(skill.id, purchases)) {
      return false;
    }

    // Filter by category if specified
    if (category && skill.category !== category) {
      return false;
    }

    return true;
  });
};

/**
 * Get all active skills across all elements, optionally filtered by category
 */
export const getAllActiveSkills = (
  purchases: Record<string, number>,
  category?: SkillCategory
): Skill[] => {
  return allSkills.filter((skill) => {
    // Must be purchased
    if (!isSkillPurchased(skill.id, purchases)) {
      return false;
    }

    // Filter by category if specified
    if (category && skill.category !== category) {
      return false;
    }

    return true;
  });
};

/**
 * Check if a skill is off cooldown for a defender
 */
export const isSkillOffCooldown = (
  skillId: string,
  defender: Defender,
  currentTime: number
): boolean => {
  if (!defender.skillCooldowns) return true;
  const cooldownEnd = defender.skillCooldowns[skillId];
  return !cooldownEnd || currentTime >= cooldownEnd;
};

/**
 * Set a skill on cooldown for a defender
 */
export const setSkillCooldown = (
  defender: Defender,
  skillId: string,
  cooldownMs: number,
  currentTime: number
): void => {
  if (!defender.skillCooldowns) {
    defender.skillCooldowns = {};
  }
  defender.skillCooldowns[skillId] = currentTime + cooldownMs;
};

/**
 * Get the best active skill for a defender to cast (highest priority that's available)
 */
export const getBestActiveSkill = (
  defender: Defender,
  purchases: Record<string, number>,
  currentTime: number,
  context?: SkillContext
): Skill | null => {
  const activeSkills = getActiveSkillsForElement(
    defender.type,
    purchases,
    "active"
  );

  const availableSkills = activeSkills
    .filter((skill) => {
      // Check if skill is off cooldown
      if (!isSkillOffCooldown(skill.id, defender, currentTime)) {
        return false;
      }

      // Check if skill can be cast (if it has a canCast condition)
      if (skill.canCast && context) {
        if (!skill.canCast(defender, context)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0)); // Higher priority first

  return availableSkills[0] || null; // Return the best skill or null if none available
};
