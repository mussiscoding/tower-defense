import type { ElementType } from "../data/elements";

export const ELEMENT_COLORS: Record<ElementType, string> = {
  fire: "#ff4444", // Red
  ice: "#4444ff", // Blue
  earth: "#8b4513", // Brown
  air: "#cccccc", // Gray
};

export const ELEMENT_SPARKLE_COLORS: Record<ElementType, string> = {
  fire: "#ffd700", // Gold for fire sparkles
  ice: "#87ceeb", // Light blue for ice sparkles
  earth: "#daa520", // Goldenrod for earth sparkles
  air: "#f0f8ff", // Alice blue for air sparkles
};

export const getElementColor = (elementType: ElementType): string => {
  return ELEMENT_COLORS[elementType] || "#ffd700"; // Default gold
};

export const getElementSparkleColor = (elementType: ElementType): string => {
  return ELEMENT_SPARKLE_COLORS[elementType] || "#ffd700"; // Default gold
};
