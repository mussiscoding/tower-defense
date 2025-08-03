import React, { useState, useEffect } from "react";
import { ENEMY_SPRITES, type EnemyType } from "../assets/enemy-sprites";
import "./EnemySprite.css";

interface EnemySpriteProps {
  type: EnemyType;
  className?: string;
  style?: React.CSSProperties;
}

const EnemySprite: React.FC<EnemySpriteProps> = ({
  type,
  className = "",
  style = {},
}) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const enemySprites = ENEMY_SPRITES[type];

  // Walking animation - cycle through frames every 300ms
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 4); // Cycle through 4 frames
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // For goblin: left-middle-right-middle cycle
  const getFrameName = (index: number): string => {
    if (type === "goblin") {
      const frameNames = ["left", "middle", "right", "middle"];
      return frameNames[index];
    }
    // For other enemies, fall back to leftFoot/rightFoot
    return index % 2 === 0 ? "leftFoot" : "rightFoot";
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
