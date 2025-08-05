import "./Defender.css";
import type { ElementType } from "../data/elements";

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
}

const Defender: React.FC<DefenderProps> = ({ type, x, y, level }) => {
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
