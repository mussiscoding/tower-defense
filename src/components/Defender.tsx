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
  const starIndicator = mageProgress && mageProgress.stars > 0 && (
    <div className="defender-stars-arc">
      {Array.from({ length: mageProgress.stars }, (_, i) => {
        const n = mageProgress.stars;
        const radius = 16;
        // Spread stars along an arc from 30° to 150° (bottom semicircle)
        const startAngle = 30;
        const endAngle = 150;
        const angleDeg = n === 1 ? 90 : startAngle + i * (endAngle - startAngle) / (n - 1);
        const angleRad = (angleDeg * Math.PI) / 180;
        const offsetX = radius * Math.cos(angleRad);
        const offsetY = radius * Math.sin(angleRad) - 6;
        return (
          <span
            key={i}
            className="defender-star"
            style={{
              color: getRankColor(mageProgress.tier),
              left: `calc(50% + ${-offsetX}px)`,
              top: `${offsetY}px`,
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );

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
          alt={`${type} mage attack frame ${currentAnimationFrame}`}
          className={`defender-sprite-image defender-sprite-${type}`}
        />
      </div>
      {starIndicator}
    </div>
  );
};

export default Defender;
