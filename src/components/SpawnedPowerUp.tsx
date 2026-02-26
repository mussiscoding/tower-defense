import React from "react";
import type { SpawnedPowerUp } from "../types/GameStateSlices";
import { getPowerUpDef } from "../data/powerups";
import "./SpawnedPowerUp.css";

interface SpawnedPowerUpProps {
  powerUp: SpawnedPowerUp;
  onClick: () => void;
}

const SpawnedPowerUpComponent: React.FC<SpawnedPowerUpProps> = ({
  powerUp,
  onClick,
}) => {
  const def = getPowerUpDef(powerUp.powerUpId);
  if (!def) return null;

  const now = Date.now();
  const totalDuration = powerUp.despawnTime - powerUp.spawnTime;
  const remaining = Math.max(0, powerUp.despawnTime - now);
  const progress = 1 - remaining / totalDuration; // 0 = full, 1 = expired

  return (
    <div
      className="spawned-powerup"
      style={{
        left: powerUp.x,
        top: powerUp.y,
        ["--glow-color" as string]: def.color,
        ["--timer-progress" as string]: `${progress * 360}deg`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="powerup-timer-ring" />
      <div className="powerup-icon">{def.icon}</div>
      <div className="powerup-tooltip">{def.description}</div>
    </div>
  );
};

export default SpawnedPowerUpComponent;
