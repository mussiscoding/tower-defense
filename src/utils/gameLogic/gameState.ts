import type { GameState } from "../../types/GameState";

export const handleCastleDestruction = (gameState: GameState): GameState => {
  return {
    ...gameState,
    isPaused: true,
    castleHealth: 0,
    enemies: [],
    arrows: [],
    defenders: [],
    goldPopups: [],
  };
};
