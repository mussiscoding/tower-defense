import "./Arrow.css";
import type { ElementType } from "../data/elements";

interface ArrowProps {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number; // 0 to 1
  elementType: ElementType;
}

const Arrow: React.FC<ArrowProps> = ({
  startX,
  startY,
  endX,
  endY,
  progress,
  elementType,
}) => {
  const currentX = startX + (endX - startX) * progress;
  const currentY = startY + (endY - startY) * progress;

  // Calculate angle for arrow rotation
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  // Get element-specific projectile
  const getProjectile = (elementType: ElementType) => {
    switch (elementType) {
      case "fire":
        return "🔥";
      case "ice":
        return "❄️";
      case "earth":
        return "🪨";
      case "air":
        return "💨";
      default:
        return "➜";
    }
  };

  return (
    <div
      className="arrow"
      style={
        {
          left: `${currentX}px`,
          top: `${currentY}px`,
          "--arrow-rotation": `${angle}deg`,
        } as React.CSSProperties
      }
    >
      {getProjectile(elementType)}
    </div>
  );
};

export default Arrow;
