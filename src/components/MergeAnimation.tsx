import { useEffect } from "react";
import type { MergeAnimation as MergeAnimationType } from "../types/GameState";
import { getRankColor } from "../utils/starSystem";
import "./MergeAnimation.css";

interface MergeAnimationProps {
  animation: MergeAnimationType;
  onComplete: (id: string) => void;
}

const MergeAnimation: React.FC<MergeAnimationProps> = ({
  animation,
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(animation.id);
    }, animation.duration);

    return () => clearTimeout(timer);
  }, [animation.id, animation.duration, onComplete]);

  const tierColor = getRankColor(animation.resultTier);

  return (
    <div className="merge-animation" style={{ pointerEvents: "none" }}>
      {animation.fromPositions.map((pos, i) => {
        const dx = animation.toPosition.x - pos.x;
        const dy = animation.toPosition.y - pos.y;
        return (
          <div
            key={i}
            className="merge-ghost"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              "--dx": `${dx}px`,
              "--dy": `${dy}px`,
              animationDuration: `${animation.duration}ms`,
            } as React.CSSProperties}
          />
        );
      })}

      <div
        className="merge-burst"
        style={{
          left: `${animation.toPosition.x + 20}px`,
          top: `${animation.toPosition.y + 20}px`,
          animationDuration: `${animation.duration}ms`,
          animationDelay: `${animation.duration * 0.6}ms`,
          borderColor: tierColor,
          boxShadow: `0 0 20px ${tierColor}, 0 0 40px ${tierColor}`,
        }}
      />

      <div
        className="merge-stars-result"
        style={{
          left: `${animation.toPosition.x + 20}px`,
          top: `${animation.toPosition.y - 5}px`,
          color: tierColor,
          animationDelay: `${animation.duration * 0.7}ms`,
          animationDuration: `${animation.duration * 0.3}ms`,
        }}
      >
        {"★".repeat(animation.resultStars)}
      </div>
    </div>
  );
};

export default MergeAnimation;
