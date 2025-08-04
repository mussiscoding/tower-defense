import React, { useState, useEffect } from "react";
import { ENEMY_SPRITES, type EnemyType } from "../assets/enemy-sprites";
import "./EnemySprite.css";

interface EnemySpriteProps {
  type: EnemyType;
  className?: string;
  style?: React.CSSProperties;
  isPaused?: boolean;
}

const EnemySprite: React.FC<EnemySpriteProps> = ({
  type,
  className = "",
  style = {},
  isPaused = false,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const enemySprites = ENEMY_SPRITES[type];

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
      className={`enemy-sprite enemy-${type} ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default EnemySprite;
