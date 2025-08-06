import React, { useState, useEffect } from "react";
import { generateGoblinSprite } from "../assets/enemies/enemy-sprites";
import "./EnemySprite.css";

interface EnemySpriteProps {
  colorIndex: number;
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

const EnemySprite: React.FC<EnemySpriteProps> = ({
  colorIndex,
  className = "",
  style = {},
  isPaused = false,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);

  // Generate goblin sprite with the specified shirt color
  const shirtColor = SHIRT_COLORS[colorIndex % SHIRT_COLORS.length];
  const enemySprites = generateGoblinSprite({
    skinColor: "#2F9D50", // Green skin
    shirtColor,
    hairColor: "#8B4513", // Brown hair
  });

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
