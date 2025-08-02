import type { GameState } from "../types/GameState";
import { shopItems, getCurrentPrice } from "../data/shopItems";
import { upgradeShopItems } from "../data/upgrades";
import { createDefender } from "../utils/gameLogic";

import "./GameSidebar.css";
import Mages from "./Mages";

interface GameSidebarProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  gameState,
  setGameState,
}) => {
  const handlePurchase = (itemId: string) => {
    const item = shopItems.find((shopItem) => shopItem.id === itemId);
    const currentPrice = getCurrentPrice(item!, gameState.purchases);
    if (!item || gameState.gold < currentPrice) return;

    setGameState((prev) => {
      // Handle click damage upgrade (special case)
      if (itemId === "click_damage_upgrade") {
        return {
          ...prev,
          gold: prev.gold - currentPrice,
          clickDamage: prev.clickDamage + 1,
          purchases: {
            ...prev.purchases,
            [itemId]: (prev.purchases[itemId] || 0) + 1,
          },
        };
      }

      // Handle upgrade shop items (they define their own effects)
      const upgradeItem = upgradeShopItems.find(
        (upgrade) => upgrade.id === itemId
      );
      if (upgradeItem) {
        const updatedState = upgradeItem.effect(prev);
        return {
          ...updatedState,
          gold: prev.gold - currentPrice,
          purchases: {
            ...prev.purchases,
            [itemId]: (prev.purchases[itemId] || 0) + 1,
          },
        };
      }

      return prev;
    });
  };

  return (
    <div className="game-sidebar">
      <div className="sidebar-section">
        <Mages
          elements={gameState.elements}
          currentGold={gameState.gold}
          purchases={gameState.purchases}
          onPurchaseMage={(elementType, cost) => {
            if (gameState.gold >= cost) {
              const randomY = Math.random() * 400 + 50;
              setGameState((prev) => ({
                ...prev,
                gold: prev.gold - cost,
                defenders: [
                  ...prev.defenders,
                  createDefender(50, randomY, elementType),
                ],
                purchases: {
                  ...prev.purchases,
                  [elementType]: (prev.purchases[elementType] || 0) + 1,
                },
              }));
            }
          }}
          onPurchaseUpgrade={(itemId) => {
            handlePurchase(itemId);
          }}
        />
      </div>

      <div className="sidebar-section">
        <h3>⚙️ Difficulty Controls</h3>
        <div className="difficulty-controls">
          <div className="control-group">
            <label htmlFor="spawn-rate">
              Enemy Spawn Rate: {gameState.spawnRateLevel}
            </label>
            <input
              id="spawn-rate"
              type="range"
              min="1"
              max="5"
              value={gameState.spawnRateLevel}
              onChange={(e) =>
                setGameState((prev) => ({
                  ...prev,
                  spawnRateLevel: parseInt(e.target.value),
                }))
              }
            />
            <div className="range-labels">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          <div className="control-group">
            <label htmlFor="difficulty">
              Enemy Difficulty: {gameState.difficultyLevel}
            </label>
            <input
              id="difficulty"
              type="range"
              min="1"
              max="3"
              value={gameState.difficultyLevel}
              onChange={(e) => {
                const newDifficulty = parseInt(e.target.value);
                setGameState((prev) => ({
                  ...prev,
                  difficultyLevel: newDifficulty,
                }));
              }}
            />
            <div className="range-labels">
              <span>Easy (Goblins)</span>
              <span>Hard (All Types)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSidebar;
