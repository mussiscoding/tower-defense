import type { GameState } from "../types/GameStateSlices";
import "./GameHeader.css";

interface GameHeaderProps {
  stateRef: React.MutableRefObject<GameState>;
  onPauseToggle: () => void;
  onReset: () => void;
  onDevGold?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  stateRef,
  onPauseToggle,
  onReset,
  onDevGold,
}) => {
  const core = stateRef.current.core;

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
        <span className="stat-value">{formatNumber(core.gold)}</span>
      </div>

      <div className="header-stat">
        <span className="stat-icon">🏰</span>
        <span className="stat-label">Castle:</span>
        <span className="stat-value">{core.castleHealth}/100</span>
      </div>

      <div className="header-stat">
        <span className="stat-icon">⏱️</span>
        <span className="stat-label">Time:</span>
        <span className="stat-value">{formatTime(core.timeSurvived)}</span>
      </div>

      <div className="header-stat">
        <span className="stat-icon">💾</span>
        <span className="stat-label">Last Save:</span>
        <span className="stat-value">
          {new Date(core.lastSave).toLocaleTimeString()}
        </span>
      </div>

      <button className="pause-button" onClick={onPauseToggle}>
        {core.isPaused ? "▶️" : "⏸️"}
      </button>

      <button className="reset-button" onClick={onReset}>
        🔄
      </button>

      {onDevGold && (
        <button className="dev-gold-button" onClick={onDevGold}>
          💰+10K
        </button>
      )}
    </header>
  );
};

export default GameHeader;
