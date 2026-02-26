import { formatNumber } from "../utils/formatNumber";
import "./GoldPopup.css";

interface GoldPopupProps {
  id: string;
  x: number;
  y: number;
  amount: number;
  onComplete: () => void;
}

const GoldPopup: React.FC<GoldPopupProps> = ({ x, y, amount, onComplete }) => {
  return (
    <div
      className="gold-popup"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onAnimationEnd={onComplete}
    >
      +{formatNumber(amount)} 💰
    </div>
  );
};

export default GoldPopup;
