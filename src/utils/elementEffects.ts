import type { Enemy } from "../types/GameState";
import type { ElementAbilities } from "../types/GameState";
import type { ElementType } from "../data/elements";

// Legacy ElementEffectResult interface - kept for potential future use
export interface ElementEffectResult {
  enemy: Enemy;
  logMessage?: string;
}

// addElementEffects function removed - functionality moved to skills system

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
