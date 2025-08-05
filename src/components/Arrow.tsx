import React from "react";
import "./Arrow.css";
import type { ElementType } from "../data/elements";
import { getElementEmoji } from "../utils/elementEffects";

interface ArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  elementType: ElementType;
}

const Arrow: React.FC<ArrowProps> = ({
  startX,
  startY,
  endX,
  endY,
  progress,
  elementType,
}) => {
  const currentX = startX + (endX - startX) * progress;
  const currentY = startY + (endY - startY) * progress;

  // Calculate angle for arrow rotation
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

  return (
    <div
      className="arrow"
      style={
        {
          left: `${currentX}px`,
          top: `${currentY}px`,
          "--arrow-rotation": `${angle}deg`,
        } as React.CSSProperties
      }
    >
      {getElementEmoji(elementType)}
    </div>
  );
};

export default Arrow;
