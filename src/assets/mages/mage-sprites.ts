// Import mage attack animation sprites
import attack1 from "./Attack1.png";
import attack2 from "./Attack2.png";
import attack3 from "./Attack3.png";
import attack4 from "./Attack4.png";
import attack5 from "./Attack5.png";
import attack6 from "./Attack6.png";
import attack7 from "./Attack7.png";
import idle from "./Idle.png";

export const mageAttackSprites = {
  idle,
  attack1,
  attack2,
  attack3,
  attack4,
  attack5,
  attack6,
  attack7,
  attack8: attack7, // Reuse attack7 image for extended last frame
};

// Animation timing constants
export const ANIMATION_CONFIG = {
  FRAME_DURATION: 100, // milliseconds per frame (doubled from 50ms)
  ATTACK_FRAME: 5, // Frame when attack happens
  PRE_ATTACK_FRAMES: 4, // Frames before attack (1-4)
  POST_ATTACK_FRAMES: 3, // Frames after attack (6-7-8)
  TOTAL_FRAMES: 8,
};
