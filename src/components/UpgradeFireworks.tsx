import React, { useEffect, useState } from "react";
import "./UpgradeFireworks.css";
import type { UpgradeAnimation } from "../types/GameState";
import { getElementColor } from "../constants/elementColors";

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
  const [fireworks, setFireworks] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      angle: number;
      delay: number;
      size: number;
    }>
  >([]);

  useEffect(() => {
    // Generate fireworks in multiple circles around the mage position
    const fireworkCount = 15;
    const circles = 2;
    const newFireworks = [];

    for (let circle = 0; circle < circles; circle++) {
      const radius = 20 + circle * 15;
      const fireworksPerCircle = Math.floor(fireworkCount / circles);

      for (let i = 0; i < fireworksPerCircle; i++) {
        const angle = (i / fireworksPerCircle) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const delay = circle * 150 + (i / fireworksPerCircle) * 200;
        const size = 8 + Math.random() * 6;

        newFireworks.push({
          id: circle * fireworksPerCircle + i,
          x: x + 1,
          y: y + 1,
          angle,
          delay,
          size,
        });
      }
    }

    setFireworks(newFireworks);

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
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="firework"
          data-element={animation.elementType}
          style={{
            left: firework.x,
            top: firework.y,
            animationDelay: `${firework.delay}ms`,
            fontSize: `${firework.size}px`,
            color: getElementColor(animation.elementType),
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

export default UpgradeFireworks;
