import React, { useEffect, useState } from "react";
import type { FloatingText as FloatingTextType } from "../types/GameState";
import { getElementColor } from "../constants/elementColors";
import "./FloatingText.css";

interface FloatingTextProps {
  text: FloatingTextType;
  onComplete: (id: string) => void;
}

const FloatingText: React.FC<FloatingTextProps> = ({ text, onComplete }) => {
  const [opacity, setOpacity] = useState(1);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    const startTime = text.startTime;
    const duration = text.duration;
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Fade out over time
    setOpacity(1 - progress);

    // Move upward over time
    setYOffset(-progress * 50); // Move up 50px over the duration

    if (progress >= 1) {
      onComplete(text.id);
    }
  }, [text, onComplete]);

  return (
    <div
      className="floating-text"
      style={{
        position: "absolute",
        left: text.x,
        top: text.y + yOffset,
        opacity: opacity,
        color: getElementColor(text.elementType),
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {text.text}
    </div>
  );
};

export default FloatingText;
