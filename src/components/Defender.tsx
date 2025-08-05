import "./Defender.css";
import type { ElementType } from "../data/elements";
import { mageAttackSprites } from "../assets/mage-sprites";

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
}

const Defender: React.FC<DefenderProps> = ({
  type,
  x,
  y,
  currentAnimationFrame = 1,
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

  if (shouldUseSprites) {
    const spriteKey =
      `attack${currentAnimationFrame}` as keyof typeof mageAttackSprites;
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
    </div>
  );
};

export default Defender;
