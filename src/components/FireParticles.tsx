import React from "react";
import "./FireParticles.css";

interface FireParticlesProps {
  x: number;
  y: number;
  isBurning: boolean;
}

const FireParticles: React.FC<FireParticlesProps> = ({ x, y, isBurning }) => {
  if (!isBurning) return null;

  return (
    <div
      className="fire-particles"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="particle particle-1">🔥</div>
      <div className="particle particle-2">🔥</div>
      <div className="particle particle-3">🔥</div>
      <div className="particle particle-4">🔥</div>
    </div>
  );
};

export default FireParticles;
