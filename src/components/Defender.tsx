import "./Defender.css";

interface DefenderProps {
  id: string;
  type: "archer" | "mage" | "trebuchet";
  x: number;
  y: number;
  damage: number;
  attackSpeed: number;
  range: number;
  lastAttack: number;
  level: number;
}

const Defender: React.FC<DefenderProps> = ({ type, x, y, level }) => {
  return (
    <div
      className={`defender defender-${type}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="defender-sprite">🏹</div>
      <div className="defender-level">Lv.{level}</div>
    </div>
  );
};

export default Defender;
