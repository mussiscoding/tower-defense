import type {
  FloatingText,
  LevelUpAnimation,
  UpgradeAnimation,
  DamageNumber,
  Enemy,
  Defender,
} from "../../types/GameState";
import type { ElementType } from "../../data/elements";
import { GAME_MECHANICS } from "../../constants/gameDimensions";

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

export const generateDamageNumberId = (): string => {
  return `damage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createDamageNumber = (
  damage: number,
  x: number,
  y: number,
  elementType: ElementType,
  currentTime: number,
  isCritical: boolean = false
): DamageNumber => {
  return {
    id: generateDamageNumberId(),
    damage,
    x,
    y,
    elementType,
    startTime: currentTime,
    isCritical,
  };
};

/**
 * Calculate where an enemy will be when an arrow reaches it
 */
export const calculatePredictedEnemyPosition = (
  defender: Defender,
  target: Enemy
): { x: number; y: number; flightTime: number } => {
  // Calculate distance from defender to current target position
  const distance = Math.sqrt(
    Math.pow(target.x + 10 - (defender.x + 20), 2) +
      Math.pow(target.y + 15 - (defender.y + 20), 2)
  );

  // Calculate how long the arrow will take to reach the target
  const flightTime = (distance / GAME_MECHANICS.ARROW_SPEED) * 1000;

  // Predict where the enemy will be when the arrow arrives
  // Enemy moves left by `speed` px per 50ms tick, so speed in px/ms is speed/50
  const predictedX = target.x - (target.speed * flightTime) / 50;
  const predictedY = target.y; // Enemies only move horizontally

  const centreOfPredictedX = predictedX;
  const centreOfPredictedY = predictedY + 15;

  return {
    x: centreOfPredictedX,
    y: centreOfPredictedY,
    flightTime,
  };
};
