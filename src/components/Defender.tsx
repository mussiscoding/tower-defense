import "./Defender.css";
import type { ElementType } from "../data/elements";
import type { MageProgress } from "../types/GameState";
import { mageAttackSprites } from "../assets/mages/mage-sprites";
import { getRankColor } from "../utils/starSystem";

interface DefenderProps {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  damage: number;
  attackSpeed: number;
  range: number;
  lastAttack: number;
  level: number;
  currentAnimationFrame?: number;
  mageProgress?: MageProgress;
}

const Defender: React.FC<DefenderProps> = ({
  type,
  x,
  y,
  currentAnimationFrame = 0,
  mageProgress,
}) => {
  const getElementColor = (elementType: ElementType) => {
    switch (elementType) {
      case "fire":
        return "#ff4444";
      case "ice":
        return "#4444ff";
      case "earth":
        return "#8b4513";
      case "air":
        return "#cccccc";
      default:
        return "#666666";
    }
  };

  // For now, only implement fire mage sprites
  const shouldUseSprites = type === "fire";

  const starIndicator = mageProgress && (
    <div
      className="defender-stars"
      style={{ color: getRankColor(mageProgress.tier) }}
    >
      {"★".repeat(mageProgress.stars)}
    </div>
  );

  if (shouldUseSprites) {
    const spriteKey =
      currentAnimationFrame === 0
        ? "idle"
        : (`attack${currentAnimationFrame}` as keyof typeof mageAttackSprites);
    const spriteSrc = mageAttackSprites[spriteKey];

    return (
      <div
        className={`defender defender-${type}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        <div className="defender-sprite-container">
          <img
            src={spriteSrc}
            alt={`Fire mage attack frame ${currentAnimationFrame}`}
            className="defender-sprite-image"
          />
        </div>
        {starIndicator}
      </div>
    );
  }

  // Fallback to original colored circle for other elements
  return (
    <div
      className={`defender defender-${type}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div
        className="defender-sprite"
        style={{ backgroundColor: getElementColor(type) }}
      ></div>
      {starIndicator}
    </div>
  );
};

export default Defender;
