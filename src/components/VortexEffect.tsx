import React, { useEffect, useState } from "react";
import type { VortexData } from "../types/GameState";
import vortex1Svg from "../assets/effects/vortex1.svg";
import "./VortexEffect.css";

interface VortexEffectProps {
  vortex: VortexData;
  currentTime: number;
}

const VortexEffect: React.FC<VortexEffectProps> = ({ vortex, currentTime }) => {
  const [rotation, setRotation] = useState(0);

  // Calculate remaining duration and rotation
  const elapsed = currentTime - vortex.startTime;
  const remaining = Math.max(0, vortex.duration - elapsed);

  // Update rotation every frame for smooth animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev - 2 + 360) % 360); // Rotate -2 degrees per frame (counter-clockwise)
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, []);

  // Don't render if vortex has expired
  if (remaining <= 0) {
    return null;
  }

  return (
    <div
      className="vortex-effect"
      style={{
        left: vortex.centerX - vortex.radius, // Center based on actual radius
        top: vortex.centerY - vortex.radius, // Center based on actual radius
        width: vortex.radius * 2,
        height: vortex.radius * 2,
      }}
    >
      {/* Rotating vortex SVG */}
      <img
        src={vortex1Svg}
        alt="Vortex"
        className="vortex-svg"
        style={{
          transform: `rotate(${rotation}deg)`,
          width: `${vortex.radius * 2}px`,
          height: `${vortex.radius * 2}px`,
        }}
      />

      {/* Pull direction indicators - subtle wind trails */}
      <div className="vortex-pull-indicators">
        {Array.from(vortex.affectedEnemyIds).map((enemyId, index) => (
          <div
            key={`pull-${enemyId}-${index}`}
            className="pull-indicator"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VortexEffect;
