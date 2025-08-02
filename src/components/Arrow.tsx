import "./Arrow.css";

interface ArrowProps {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number; // 0 to 1
}

const Arrow: React.FC<ArrowProps> = ({
  startX,
  startY,
  endX,
  endY,
  progress,
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
      ➜
    </div>
  );
};

export default Arrow;
