import React, { useState, useEffect } from "react";
import "./DamageNumber.css";
import type { ElementType } from "../data/elements";
import { getElementColor } from "../constants/elementColors";

interface DamageNumberProps {
  damage: number;
  x: number;
  y: number;
  elementType: ElementType;
  onComplete: () => void;
  isCritical?: boolean;
}

const DamageNumber: React.FC<DamageNumberProps> = ({
  damage,
  x,
  y,
  elementType,
  onComplete,
  isCritical = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 200);
    }, 700);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`damage-number ${isCritical ? "critical-hit" : ""}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        color: getElementColor(elementType),
      }}
    >
      {damage}
    </div>
  );
};

export default DamageNumber;
