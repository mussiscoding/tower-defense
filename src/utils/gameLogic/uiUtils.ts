import type {
  FloatingText,
  LevelUpAnimation,
  UpgradeAnimation,
} from "../../types/GameState";
import type { ElementType } from "../../data/elements";

export const generateFloatingTextId = (): string => {
  return `floating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateLevelUpAnimationId = (): string => {
  return `levelup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateUpgradeAnimationId = (): string => {
  return `upgrade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createFloatingText = (
  text: string,
  x: number,
  y: number,
  elementType: ElementType,
  currentTime: number
): FloatingText => {
  return {
    id: generateFloatingTextId(),
    text,
    x,
    y,
    startTime: currentTime,
    duration: 3000, // 3 seconds duration
    color: "", // Will be determined by component
    elementType,
  };
};

export const createLevelUpAnimation = (
  elementType: ElementType,
  x: number,
  y: number,
  currentTime: number
): LevelUpAnimation => {
  return {
    id: generateLevelUpAnimationId(),
    elementType,
    x,
    y,
    startTime: currentTime,
    duration: 3000, // 3 seconds duration
  };
};

export const createUpgradeAnimation = (
  shortName: string,
  elementType: ElementType,
  mageX: number,
  mageY: number,
  currentTime: number
): UpgradeAnimation => {
  return {
    id: generateUpgradeAnimationId(),
    shortName,
    elementType,
    mageX,
    mageY,
    startTime: currentTime,
    duration: 1500, // 1.5 seconds duration
  };
};
