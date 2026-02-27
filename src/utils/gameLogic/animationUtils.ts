import { ANIMATION_CONFIG } from "../../assets/mages/mage-sprites";
import type { Defender } from "../../types/GameState";

export const calculateAnimationFrame = (
  defender: Defender,
  currentTime: number
): number => {
  const timeSinceLastAttack = currentTime - defender.lastAttack;
  const attackCooldown = 1000 / defender.attackSpeed;
  const timeUntilNextAttack = attackCooldown - timeSinceLastAttack;

  const postAttackWindow =
    ANIMATION_CONFIG.FRAME_DURATION *
    (ANIMATION_CONFIG.POST_ATTACK_FRAMES + 1); // +1 for the attack frame itself

  // Post-attack follow-through (frames 5-8): use timeSinceLastAttack
  // Right after attack fires, lastAttack resets so timeSinceLastAttack is small
  if (
    defender.lastAttack > 0 &&
    timeSinceLastAttack < postAttackWindow
  ) {
    const postFrame = Math.floor(
      timeSinceLastAttack / ANIMATION_CONFIG.FRAME_DURATION
    );
    // Frame 5 (attack), 6, 7, 8
    const frame = ANIMATION_CONFIG.PRE_ATTACK_FRAMES + 1 + postFrame;
    if (frame <= ANIMATION_CONFIG.TOTAL_FRAMES) {
      return frame;
    }
    return 0;
  }

  // Pre-attack wind-up (frames 1-4): use timeUntilNextAttack
  if (
    timeUntilNextAttack <=
    ANIMATION_CONFIG.FRAME_DURATION * ANIMATION_CONFIG.PRE_ATTACK_FRAMES
  ) {
    const framesIntoAttack = Math.floor(
      (ANIMATION_CONFIG.FRAME_DURATION * ANIMATION_CONFIG.PRE_ATTACK_FRAMES -
        timeUntilNextAttack) /
        ANIMATION_CONFIG.FRAME_DURATION
    );
    if (
      framesIntoAttack >= 0 &&
      framesIntoAttack < ANIMATION_CONFIG.PRE_ATTACK_FRAMES
    ) {
      return framesIntoAttack + 1;
    }
  }

  return 0; // Idle
};

export const getMageSprite = (frame: number): string => {
  const sprites = [
    "idle", // frame 0 (idle)
    "attack1",
    "attack2",
    "attack3",
    "attack4",
    "attack5",
    "attack6",
    "attack7",
    "attack8",
  ];

  return sprites[frame] || "idle";
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
