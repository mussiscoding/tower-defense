import type { Enemy } from "../types/GameState";
import type { ElementAbilities } from "../types/GameState";
import type { ElementType } from "../data/elements";

export interface ElementEffectResult {
  enemy: Enemy;
  logMessage?: string;
}

export const addElementEffects = (
  enemy: Enemy,
  elementType: string,
  elementAbilities: ElementAbilities,
  currentTime: number,
  arrowDamage?: number
): ElementEffectResult => {
  let updatedEnemy = enemy;

  // Apply fire element burn effect
  if (
    elementType === "fire" &&
    elementAbilities.burnDamagePercent &&
    elementAbilities.burnDuration
  ) {
    // Calculate burn damage as percentage of arrow damage
    const burnDamagePercent = elementAbilities.burnDamagePercent || 0;
    const burnDamage = arrowDamage
      ? Math.floor((arrowDamage * burnDamagePercent) / 100)
      : 0;

    updatedEnemy = {
      ...updatedEnemy,
      burnDamage: burnDamage,
      burnEndTime: currentTime + elementAbilities.burnDuration * 1000,
    };
  }

  // Apply ice element slow effect
  if (
    elementType === "ice" &&
    elementAbilities.slowEffect &&
    elementAbilities.slowDuration
  ) {
    updatedEnemy = {
      ...updatedEnemy,
      slowEffect: elementAbilities.slowEffect,
      slowEndTime: currentTime + elementAbilities.slowDuration * 1000,
    };
  }

  return {
    enemy: updatedEnemy,
  };
};

// Get element-specific emoji for projectiles, fireworks, and other UI elements
export const getElementEmoji = (elementType: ElementType) => {
  switch (elementType) {
    case "fire":
      return "🔥";
    case "ice":
      return "❄️";
    case "earth":
      return "🪨";
    case "air":
      return "🌪️";
    default:
      return "✨";
  }
};
