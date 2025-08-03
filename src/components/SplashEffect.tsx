import React from "react";
import type { SplashEffect } from "../types/GameState";
import "./SplashEffect.css";

interface SplashEffectProps {
  effect: SplashEffect;
  currentTime: number;
}

const SplashEffectComponent: React.FC<SplashEffectProps> = ({
  effect,
  currentTime,
}) => {
  const elapsed = currentTime - effect.startTime;
  const progress = Math.min(elapsed / effect.duration, 1);

  // Calculate corner positions - scale down the visual radius to 1/3 of actual radius
  const visualRadius = effect.radius / 3;
  const corners = [
    { x: effect.centerX - visualRadius, y: effect.centerY - visualRadius }, // Top-left
    { x: effect.centerX + visualRadius, y: effect.centerY - visualRadius }, // Top-right
    { x: effect.centerX + visualRadius, y: effect.centerY + visualRadius }, // Bottom-right
    { x: effect.centerX - visualRadius, y: effect.centerY + visualRadius }, // Bottom-left
  ];

  // Calculate arrow positions based on progress
  const arrowPositions = corners.map((corner) => {
    const startX = effect.centerX;
    const startY = effect.centerY;
    const endX = corner.x;
    const endY = corner.y;

    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    // Calculate angle for arrow rotation
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    return { currentX, currentY, angle };
  });

  return (
    <>
      {arrowPositions.map((arrow, index) => (
        <div
          key={`${effect.id}-arrow-${index}`}
          className="splash-arrow"
          style={
            {
              left: `${arrow.currentX}px`,
              top: `${arrow.currentY}px`,
              "--arrow-rotation": `${arrow.angle}deg`,
              opacity: 1 - progress * 0.5, // Fade out slightly
            } as React.CSSProperties
          }
        >
          🪨
        </div>
      ))}
    </>
  );
};

export default SplashEffectComponent;
