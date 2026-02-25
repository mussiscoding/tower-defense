import { useEffect, useState } from "react";
import { achievementMap } from "../data/achievements";
import "./AchievementPopup.css";

interface AchievementPopupProps {
  achievementId: string;
  onComplete: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievementId,
  onComplete,
}) => {
  const [fading, setFading] = useState(false);
  const def = achievementMap[achievementId];

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2500);
    const removeTimer = setTimeout(() => onComplete(), 3200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [achievementId, onComplete]);

  if (!def) return null;

  return (
    <div className={`achievement-popup ${fading ? "fading-out" : ""}`}>
      <div className="achievement-popup-glow" />
      <div className="achievement-popup-content">
        <div className="achievement-popup-icon">{def.icon}</div>
        <div className="achievement-popup-text">
          <div className="achievement-popup-label">Achievement Unlocked!</div>
          <div className="achievement-popup-name">{def.name}</div>
          <div className="achievement-popup-desc">{def.description}</div>
        </div>
        <div className="achievement-popup-reward">+{def.reward}g</div>
      </div>
    </div>
  );
};

export default AchievementPopup;
