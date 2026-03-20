import { formatNumber } from "../utils/formatNumber";
import "./XpPopup.css";

interface XpPopupProps {
  id: string;
  x: number;
  y: number;
  amount: number;
  elementType?: string;
  onComplete: () => void;
}

const XpPopup: React.FC<XpPopupProps> = ({ x, y, amount, elementType, onComplete }) => {
  const label = elementType
    ? `+${formatNumber(amount)} ${elementType} XP`
    : `+${formatNumber(amount)} XP`;

  return (
    <div
      className="xp-popup"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onAnimationEnd={onComplete}
    >
      {label}
    </div>
  );
};

export default XpPopup;
