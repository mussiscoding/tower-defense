import type { GameState } from "../types/GameState";
import "./GameHeader.css";

interface GameHeaderProps {
  gameState: GameState;
  onPauseToggle: () => void;
  onReset: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  gameState,
  onPauseToggle,
  onReset,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${Math.floor(num / 1000000)}M`;
    if (num >= 1000) return `${Math.floor(num / 1000)}K`;
    return num.toString();
  };

  return (
    <header className="game-header">
      <div className="header-stat">
        <span className="stat-icon">💰</span>
        <span className="stat-label">Gold:</span>
        <span className="stat-value">{formatNumber(gameState.gold)}</span>
      </div>

      <div className="header-stat">
        <span className="stat-icon">🏰</span>
        <span className="stat-label">Castle:</span>
        <span className="stat-value">{gameState.castleHealth}/100</span>
      </div>

      <div className="header-stat">
        <span className="stat-icon">⏱️</span>
        <span className="stat-label">Time:</span>
        <span className="stat-value">{formatTime(gameState.timeSurvived)}</span>
      </div>

      <div className="header-stat">
        <span className="stat-icon">💾</span>
        <span className="stat-label">Last Save:</span>
        <span className="stat-value">
          {new Date(gameState.lastSave).toLocaleTimeString()}
        </span>
      </div>

      <button className="pause-button" onClick={onPauseToggle}>
        {gameState.isPaused ? "▶️" : "⏸️"}
      </button>

      <button className="reset-button" onClick={onReset}>
        🔄
      </button>
    </header>
  );
};

export default GameHeader;
