import type { GameState } from "../types/GameStateSlices";
import "./GameHeader.css";

interface GameHeaderProps {
  stateRef: React.MutableRefObject<GameState>;
  onPauseToggle: () => void;
  onReset: () => void;
  onDevGold?: () => void;
  onDifficultyChange: (delta: number) => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  stateRef,
  onPauseToggle,
  onReset,
  onDevGold,
  onDifficultyChange,
}) => {
  const core = stateRef.current.core;

  const formatNumber = (num: number): string => {
    if (num >= 100000000) return `${Math.floor(num / 1000000)}M`;
    if (num >= 100000) return `${Math.floor(num / 1000)}K`;
    return Math.floor(num).toString();
  };

  const waveHP = Math.floor(50 * Math.pow(1.3, core.difficultyLevel - 1));

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

      <div className="header-stat difficulty-stat">
        <span className="stat-icon">⚔️</span>
        <span className="stat-label">Difficulty:</span>
        <button
          className="difficulty-btn"
          onClick={() => onDifficultyChange(-1)}
        >
          -
        </button>
        <span className="stat-value">{core.difficultyLevel}</span>
        <button
          className="difficulty-btn"
          onClick={() => onDifficultyChange(1)}
        >
          +
        </button>
        <span className="wave-hp">({formatNumber(waveHP)} wave HP)</span>
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
