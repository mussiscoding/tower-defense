import React, { useEffect, useState } from "react";
import "./LevelUpAnimation.css";
import type { LevelUpAnimation as LevelUpAnimationType } from "../types/GameState";
import type { ElementType } from "../data/elements";

interface LevelUpAnimationProps {
  animation: LevelUpAnimationType;
  onComplete: (id: string) => void;
}

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  animation,
  onComplete,
}) => {
  const [sparkles, setSparkles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      angle: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    // Generate sparkles in a circle around the mage
    const sparkleCount = 12;
    const radius = 25; // Smaller radius for tighter circle
    const newSparkles = [];

    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * 2 * Math.PI;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const delay = (i / sparkleCount) * 500; // Stagger the sparkles

      newSparkles.push({
        id: i,
        x,
        y,
        angle,
        delay,
      });
    }

    setSparkles(newSparkles);

    // Clean up animation after duration
    const timer = setTimeout(() => {
      onComplete(animation.id);
    }, animation.duration);

    return () => clearTimeout(timer);
  }, [animation.id, animation.duration, onComplete]);

  const getElementColor = (elementType: ElementType): string => {
    switch (elementType) {
      case "fire":
        return "#ffd700"; // Gold for fire
      case "ice":
        return "#87ceeb"; // Light blue for ice
      case "earth":
        return "#daa520"; // Goldenrod for earth
      case "air":
        return "#f0f8ff"; // Alice blue for air
      default:
        return "#ffd700"; // Default gold
    }
  };

  return (
    <div
      className="level-up-animation"
      style={{
        left: animation.x,
        top: animation.y,
        position: "absolute",
        pointerEvents: "none",
      }}
    >
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          data-element={animation.elementType}
          style={{
            left: sparkle.x,
            top: sparkle.y,
            animationDelay: `${sparkle.delay}ms`,
            color: getElementColor(animation.elementType),
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

export default LevelUpAnimation;
