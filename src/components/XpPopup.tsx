import { formatNumber } from "../utils/formatNumber";
import "./XpPopup.css";

interface XpPopupProps {
  id: string;
  x: number;
  y: number;
  amount: number;
  onComplete: () => void;
}

const XpPopup: React.FC<XpPopupProps> = ({ x, y, amount, onComplete }) => {
  return (
    <div
      className="xp-popup"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onAnimationEnd={onComplete}
    >
      +{formatNumber(amount)} XP
    </div>
  );
};

export default XpPopup;
