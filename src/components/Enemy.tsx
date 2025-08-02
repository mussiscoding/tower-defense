import type { Enemy as EnemyType } from "../types/GameState";
import "./Enemy.css";

interface EnemyProps {
  enemy: EnemyType;
  onClick: (enemy: EnemyType) => void;
}

const Enemy: React.FC<EnemyProps> = ({ enemy, onClick }) => {
  const healthPercentage = (enemy.health / enemy.maxHealth) * 100;

  const getEnemyEmoji = (type: string) => {
    switch (type) {
      case "goblin":
        return "👹";
      case "orc":
        return "👺";
      case "troll":
        return "🧌";
      default:
        return "👹";
    }
  };

  return (
    <div
      className="enemy"
      style={{
        left: `${enemy.x}px`,
        top: `${enemy.y}px`,
      }}
      onClick={() => onClick(enemy)}
    >
      <div className="enemy-health-bar">
        <div
          className="enemy-health-fill"
          style={{ width: `${healthPercentage}%` }}
        ></div>
      </div>
      <div className="enemy-sprite">{getEnemyEmoji(enemy.type)}</div>
      <div className="enemy-health-text">
        {enemy.health}/{enemy.maxHealth}
      </div>
    </div>
  );
};

export default Enemy;
