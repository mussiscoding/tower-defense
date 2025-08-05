import React, { useEffect } from "react";
import "./UpgradeFireworks.css";
import type { UpgradeAnimation } from "../types/GameState";
import { getElementColor } from "../constants/elementColors";
import { getElementEmoji } from "../utils/elementEffects";

interface UpgradeFireworksProps {
  animation: UpgradeAnimation;
  x: number;
  y: number;
  onComplete: (id: string) => void;
}

const UpgradeFireworks: React.FC<UpgradeFireworksProps> = ({
  animation,
  x,
  y,
  onComplete,
}) => {
  useEffect(() => {
    // Clean up animation after duration
    const timer = setTimeout(() => {
      onComplete(animation.id);
    }, animation.duration);

    return () => clearTimeout(timer);
  }, [animation.id, animation.duration, onComplete]);

  return (
    <div
      className="upgrade-fireworks"
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <div
        className="firework"
        data-element={animation.elementType}
        style={{
          fontSize: "48px", // Full size of mage icon
          opacity: 0.6, // 60% opacity
          animation: "firework-animation 1.5s ease-out forwards",
          color: getElementColor(animation.elementType),
          textAlign: "center",
          lineHeight: "1",
        }}
      >
        {getElementEmoji(animation.elementType)}
      </div>
    </div>
  );
};

export default UpgradeFireworks;
