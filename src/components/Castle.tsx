import "./Castle.css";
import { GAME_DIMENSIONS } from "../constants/gameDimensions";

const Castle: React.FC = () => {
  return (
    <div
      className="castle-container"
      style={
        {
          "--castle-width": `${GAME_DIMENSIONS.CASTLE_WIDTH}px`,
        } as React.CSSProperties
      }
    ></div>
  );
};

export default Castle;
