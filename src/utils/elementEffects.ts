import type { Enemy } from "../types/GameState";
import type { ElementAbilities } from "../types/GameState";

export interface ElementEffectResult {
  enemy: Enemy;
  logMessage?: string;
}

export const addElementEffects = (
  enemy: Enemy,
  elementType: string,
  elementAbilities: ElementAbilities,
  currentTime: number
): ElementEffectResult => {
  let updatedEnemy = enemy;
  let logMessage: string | undefined;

  // Apply fire element burn effect
  if (
    elementType === "fire" &&
    elementAbilities.burnDamage &&
    elementAbilities.burnDuration
  ) {
    logMessage = `🔥 Fire arrow applied burn to enemy ${enemy.id} (${enemy.type}): ${elementAbilities.burnDamage} damage for ${elementAbilities.burnDuration}s`;
    updatedEnemy = {
      ...updatedEnemy,
      burnDamage: elementAbilities.burnDamage,
      burnEndTime: currentTime + elementAbilities.burnDuration * 1000,
    };
  }

  // Apply ice element slow effect
  if (
    elementType === "ice" &&
    elementAbilities.slowEffect &&
    elementAbilities.slowDuration
  ) {
    logMessage = `❄️ Ice arrow applied slow to enemy ${enemy.id} (${enemy.type}): ${elementAbilities.slowEffect}% slow for ${elementAbilities.slowDuration}s`;
    updatedEnemy = {
      ...updatedEnemy,
      slowEffect: elementAbilities.slowEffect,
      slowEndTime: currentTime + elementAbilities.slowDuration * 1000,
    };
  }

  return {
    enemy: updatedEnemy,
    logMessage,
  };
};
