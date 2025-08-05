import { ANIMATION_CONFIG } from "../../assets/mage-sprites";
import type { Defender } from "../../types/GameState";

export const calculateAnimationFrame = (
  defender: Defender,
  currentTime: number
): number => {
  const timeSinceLastAttack = currentTime - defender.lastAttack;
  const attackCooldown = 1000 / defender.attackSpeed;
  const timeUntilNextAttack = attackCooldown - timeSinceLastAttack;

  // If we haven't attacked yet or we're in the idle period
  if (
    timeUntilNextAttack >
    ANIMATION_CONFIG.FRAME_DURATION * ANIMATION_CONFIG.PRE_ATTACK_FRAMES
  ) {
    return 1;
  }

  // Calculate how many frames into the attack animation we are
  // Start animation when we're within the pre-attack window
  const framesIntoAttack = Math.floor(
    (ANIMATION_CONFIG.FRAME_DURATION * ANIMATION_CONFIG.PRE_ATTACK_FRAMES -
      timeUntilNextAttack) /
      ANIMATION_CONFIG.FRAME_DURATION
  );

  // Attack animation sequence: frames 1 -> 2 -> 3 -> 4 -> 5 (attack) -> 6 -> 7 -> 1
  if (
    framesIntoAttack >= 0 &&
    framesIntoAttack < ANIMATION_CONFIG.PRE_ATTACK_FRAMES
  ) {
    // Pre-attack frames (1-4)
    return framesIntoAttack + 1;
  } else if (
    framesIntoAttack >= ANIMATION_CONFIG.PRE_ATTACK_FRAMES &&
    framesIntoAttack <
      ANIMATION_CONFIG.PRE_ATTACK_FRAMES + ANIMATION_CONFIG.POST_ATTACK_FRAMES
  ) {
    // Post-attack frames (6-7)
    return framesIntoAttack + 1;
  } else {
    // Back to idle
    return 1;
  }
};

export const getMageSprite = (frame: number): string => {
  const sprites = [
    "", // frame 0 (not used)
    "attack1",
    "attack2",
    "attack3",
    "attack4",
    "attack5",
    "attack6",
    "attack7",
  ];

  return sprites[frame] || "attack1";
};

// Debug function to test animation timing
export const debugAnimationTiming = (
  defender: Defender,
  currentTime: number
): void => {
  const timeSinceLastAttack = currentTime - defender.lastAttack;
  const attackCooldown = 1000 / defender.attackSpeed;
  const timeUntilNextAttack = attackCooldown - timeSinceLastAttack;
  const frame = calculateAnimationFrame(defender, currentTime);

  console.log(`🔥 Fire Mage Animation Debug:`);
  console.log(`  Time since last attack: ${timeSinceLastAttack.toFixed(0)}ms`);
  console.log(`  Attack cooldown: ${attackCooldown.toFixed(0)}ms`);
  console.log(`  Time until next attack: ${timeUntilNextAttack.toFixed(0)}ms`);
  console.log(`  Current frame: ${frame}`);
};
