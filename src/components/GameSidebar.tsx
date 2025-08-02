import type { GameState } from "../types/GameState";
import { shopItems, getCurrentPrice } from "../data/shopItems";
import { createDefender } from "../utils/gameLogic";
import { useState } from "react";
import "./GameSidebar.css";

interface GameSidebarProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  gameState,
  setGameState,
}) => {
  const [activeTab, setActiveTab] = useState<"defenders" | "upgrades">(
    "defenders"
  );

  const defenderItems = shopItems.filter((item) => item.type === "defender");
  const upgradeItems = shopItems.filter((item) => item.type === "upgrade");

  const handlePurchase = (itemId: string) => {
    const item = shopItems.find((shopItem) => shopItem.id === itemId);
    const currentPrice = getCurrentPrice(item!, gameState.purchases);
    if (!item || gameState.gold < currentPrice) return;

    setGameState((prev) => {
      // Handle defender purchases
      if (item.type === "defender") {
        const randomY = Math.random() * 400 + 50;
        return {
          ...prev,
          gold: prev.gold - currentPrice,
          defenders: [...prev.defenders, createDefender(50, randomY, itemId)],
          purchases: {
            ...prev.purchases,
            [itemId]: (prev.purchases[itemId] || 0) + 1,
          },
        };
      }

      // Handle upgrade purchases
      switch (itemId) {
        case "click_damage_upgrade":
          return {
            ...prev,
            gold: prev.gold - currentPrice,
            clickDamage: prev.clickDamage + 1,
            purchases: {
              ...prev.purchases,
              [itemId]: (prev.purchases[itemId] || 0) + 1,
            },
          };

        case "archer_damage_upgrade":
          return {
            ...prev,
            gold: prev.gold - currentPrice,
            defenders: prev.defenders.map((defender) =>
              defender.type === "archer"
                ? { ...defender, damage: defender.damage + 1 }
                : defender
            ),
            purchases: {
              ...prev.purchases,
              [itemId]: (prev.purchases[itemId] || 0) + 1,
            },
          };

        case "archer_speed_upgrade":
          return {
            ...prev,
            gold: prev.gold - currentPrice,
            defenders: prev.defenders.map((defender) =>
              defender.type === "archer"
                ? { ...defender, attackSpeed: defender.attackSpeed + 0.5 }
                : defender
            ),
            purchases: {
              ...prev.purchases,
              [itemId]: (prev.purchases[itemId] || 0) + 1,
            },
          };

        default:
          return prev;
      }
    });
  };

  return (
    <div className="game-sidebar">
      <div className="sidebar-section">
        <h3>🏪 Shop</h3>

        {/* Tab Navigation */}
        <div className="shop-tabs">
          <button
            className={`tab-button ${
              activeTab === "defenders" ? "active" : ""
            }`}
            onClick={() => setActiveTab("defenders")}
          >
            🛡️ Defenders
          </button>
          <button
            className={`tab-button ${activeTab === "upgrades" ? "active" : ""}`}
            onClick={() => setActiveTab("upgrades")}
          >
            ⚡ Upgrades
          </button>
        </div>

        {/* Tab Content */}
        <div className="shop-items">
          {activeTab === "defenders" &&
            defenderItems.map((item) => (
              <div
                key={item.id}
                className={`shop-item ${
                  gameState.gold >= getCurrentPrice(item, gameState.purchases)
                    ? "affordable"
                    : "expensive"
                }`}
                onClick={() => handlePurchase(item.id)}
              >
                <div className="item-header">
                  <h4>{item.name}</h4>
                  <span className="item-cost">
                    💰 {getCurrentPrice(item, gameState.purchases)}
                  </span>
                </div>
                <p className="item-description">{item.description}</p>
              </div>
            ))}

          {activeTab === "upgrades" &&
            upgradeItems.map((item) => (
              <div
                key={item.id}
                className={`shop-item ${
                  gameState.gold >= getCurrentPrice(item, gameState.purchases)
                    ? "affordable"
                    : "expensive"
                }`}
                onClick={() => handlePurchase(item.id)}
              >
                <div className="item-header">
                  <h4>{item.name}</h4>
                  <span className="item-cost">
                    💰 {getCurrentPrice(item, gameState.purchases)}
                  </span>
                </div>
                <p className="item-description">{item.description}</p>
              </div>
            ))}
        </div>
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
