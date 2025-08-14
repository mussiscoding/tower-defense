import React, { useState, useEffect } from "react";
import iceBlock1 from "../assets/effects/iceBlock1.svg";
import iceBlock2 from "../assets/effects/iceBlock2.svg";
import "./IceBlockEffect.css";

interface IceBlockEffectProps {
  x: number;
  y: number;
  isFrozen: boolean;
}

const IceBlockEffect: React.FC<IceBlockEffectProps> = ({ x, y, isFrozen }) => {
  const [iceBlockType, setIceBlockType] = useState<1 | 2>(1);

  useEffect(() => {
    if (!isFrozen) {
      setIceBlockType(1); // Reset to first ice block when not frozen
      return;
    }

    // Switch to iceBlock2 after 300ms
    const timer = setTimeout(() => {
      setIceBlockType(2);
    }, 300);

    return () => clearTimeout(timer);
  }, [isFrozen]);

  if (!isFrozen) return null;

  return (
    <div
      className="ice-block-effect"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <img
        src={iceBlockType === 1 ? iceBlock1 : iceBlock2}
        alt={`Ice Block ${iceBlockType}`}
        className="ice-block-image"
      />
    </div>
  );
};

export default IceBlockEffect;
