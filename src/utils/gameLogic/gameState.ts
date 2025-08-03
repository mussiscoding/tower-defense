import type { GameState } from "../../types/GameState";

export const handleCastleDestruction = (gameState: GameState): GameState => {
  return {
    ...gameState,
    isPaused: false,
    castleHealth: 100,
    enemies: [],
    arrows: [],
    goldPopups: [],
    gold: Math.floor(gameState.gold / 2),
    predictedArrowDamage: new Map(),
    predictedBurnDamage: new Map(),
  };
};
