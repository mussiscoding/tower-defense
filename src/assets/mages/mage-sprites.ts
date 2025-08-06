// Import mage attack animation sprites
import attack1 from "./mages/Attack1.png";
import attack2 from "./mages/Attack2.png";
import attack3 from "./mages/Attack3.png";
import attack4 from "./mages/Attack4.png";
import attack5 from "./mages/Attack5.png";
import attack6 from "./mages/Attack6.png";
import attack7 from "./mages/Attack7.png";
import idle from "./mages/Idle.png";

export const mageAttackSprites = {
  idle,
  attack1,
  attack2,
  attack3,
  attack4,
  attack5,
  attack6,
  attack7,
};

// Animation timing constants
export const ANIMATION_CONFIG = {
  FRAME_DURATION: 100, // milliseconds per frame (doubled from 50ms)
  ATTACK_FRAME: 5, // Frame when attack happens
  PRE_ATTACK_FRAMES: 4, // Frames before attack (1-4)
  POST_ATTACK_FRAMES: 2, // Frames after attack (6-7)
  TOTAL_FRAMES: 7,
};
