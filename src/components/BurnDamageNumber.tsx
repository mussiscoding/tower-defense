import React, { useEffect, useState } from "react";
import "./BurnDamageNumber.css";

interface BurnDamageNumberProps {
  damage: number;
  x: number;
  y: number;
  onComplete: () => void;
}

const BurnDamageNumber: React.FC<BurnDamageNumberProps> = ({
  damage,
  x,
  y,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="burn-damage-number"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      🔥 {damage}
    </div>
  );
};

export default BurnDamageNumber;
