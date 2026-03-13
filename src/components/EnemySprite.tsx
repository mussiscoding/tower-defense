import React, { useState, useEffect } from "react";
import type { EnemyType } from "../types/GameState";
import { generateGoblinSprite } from "../assets/enemies/enemy-sprites";
import { generateBeastSprite } from "../assets/enemies/beast-sprites";
import { generateSlimeSprite } from "../assets/enemies/slime-sprites";
import "./EnemySprite.css";

interface EnemySpriteProps {
  colorIndex: number;
  enemyType?: EnemyType;
  className?: string;
  style?: React.CSSProperties;
  isPaused?: boolean;
}

// Color palette for shirt colors (12 distinct colors from the color wheel)
const SHIRT_COLORS = [
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#00FFFF", // Cyan
  "#0080FF", // Blue
  "#8000FF", // Purple
  "#FF00FF", // Magenta
  "#FF0080", // Pink
  "#FF0000", // Red
  "#FF8000", // Orange
  "#FFB300", // Amber
  "#80FF00", // Lime
  "#00FF80", // Spring Green
];

function getSpriteFrames(enemyType: EnemyType | undefined, colorIndex: number) {
  switch (enemyType) {
    case "beast":
      return generateBeastSprite();
    case "slime":
    case "slime_child":
      return generateSlimeSprite();
    case "giant":
    case "goblin":
    default: {
      const shirtColor = SHIRT_COLORS[colorIndex % SHIRT_COLORS.length];
      return generateGoblinSprite({
        skinColor: "#2F9D50",
        shirtColor,
        hairColor: "#8B4513",
      });
    }
  }
}

const EnemySprite: React.FC<EnemySpriteProps> = ({
  colorIndex,
  enemyType,
  className = "",
  style = {},
  isPaused = false,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);

  const enemySprites = getSpriteFrames(enemyType, colorIndex);

  // Walking animation - cycle through frames every 300ms
  useEffect(() => {
    if (isPaused) return; // Don't animate when paused

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 4); // Cycle through 4 frames
    }, 300);

    return () => clearInterval(interval);
  }, [isPaused]);

  // All enemies now use the same 4-frame animation: left-middle-right-middle
  const getFrameName = (index: number): string => {
    const frameNames = ["left", "middle", "right", "middle"];
    return frameNames[index];
  };

  const frameName = getFrameName(frameIndex);
  const svgContent = enemySprites[frameName as keyof typeof enemySprites];

  return (
    <div
      className={`enemy-sprite enemy-goblin-${colorIndex} ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default EnemySprite;
