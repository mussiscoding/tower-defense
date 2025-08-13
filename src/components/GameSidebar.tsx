import type { GameState } from "../types/GameState";
import type { ElementType } from "../data/elements";
import { shopItems, getCurrentPrice } from "../data/shopItems";
import { allUpgrades } from "../data/upgrades";
import { getBisectingDefenderPosition } from "../utils/gameLogic/defender";
import { createDefender, canPurchaseMage } from "../utils/gameLogic";
import {
  createUpgradeAnimation,
  createFloatingText,
} from "../utils/gameLogic/uiUtils";
import { GAME_DIMENSIONS } from "../constants/gameDimensions";
import { purchaseSkill } from "../utils/skillUtils";

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
  const handleSkillPurchase = (skillId: string) => {
    setGameState((prev) => purchaseSkill(prev, skillId));
  };

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
      const upgradeItem = allUpgrades.find((upgrade) => upgrade.id === itemId);
      if (upgradeItem) {
        const updatedState = upgradeItem.effect(prev);

        // Determine the element type from the upgrade ID
        const elementType = itemId.split("_")[0] as ElementType; // fire, ice, earth, air

        // Find all mages of this element type to get their positions
        const magesOfType = prev.defenders.filter(
          (defender) => defender.type === elementType
        );

        // Create fireworks animation and floating text for each mage of this element type
        const newUpgradeAnimations = magesOfType.map((mage) => {
          return createUpgradeAnimation(
            upgradeItem.shortName || item.name,
            elementType,
            mage.x - 5, // Center of the mage (40px container)
            mage.y - 5,
            Date.now()
          );
        });

        // Create floating texts for each mage
        const newFloatingTexts = magesOfType.map((mage) => {
          return createFloatingText(
            upgradeItem.shortName || item.name,
            mage.x + 20, // Center of the mage
            mage.y - 2, // Position above the mage like level up text
            elementType,
            Date.now()
          );
        });

        return {
          ...updatedState,
          gold: prev.gold - currentPrice,
          purchases: {
            ...prev.purchases,
            [itemId]: (prev.purchases[itemId] || 0) + 1,
          },
          upgradeAnimations: [
            ...prev.upgradeAnimations,
            ...newUpgradeAnimations,
          ],
          floatingTexts: [...prev.floatingTexts, ...newFloatingTexts],
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
          defenders={gameState.defenders}
          onPurchaseMage={(elementType, cost) => {
            const elementLevel = gameState.elements[elementType]?.level || 1;
            const canPurchase = canPurchaseMage(
              gameState.defenders,
              elementType,
              elementLevel
            );

            if (gameState.gold >= cost && canPurchase) {
              const smartY = getBisectingDefenderPosition(gameState.defenders);
              setGameState((prev) => ({
                ...prev,
                gold: prev.gold - cost,
                defenders: [
                  ...prev.defenders,
                  createDefender(
                    GAME_DIMENSIONS.DEFENDER_SPAWN_X,
                    smartY,
                    elementType
                  ),
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
          onPurchaseSkill={handleSkillPurchase}
        />
      </div>

      <div className="sidebar-section">
        <h3>⚙️ Difficulty Controls</h3>
        <div className="difficulty-controls">
          <div className="control-group">
            <label htmlFor="difficulty">Difficulty Level</label>
            <div className="difficulty-input">
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    difficultyLevel: Math.max(1, prev.difficultyLevel - 10),
                  }))
                }
              >
                -10
              </button>
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    difficultyLevel: Math.max(1, prev.difficultyLevel - 1),
                  }))
                }
              >
                -1
              </button>
              <input
                type="number"
                min="1"
                max="10000"
                value={gameState.difficultyLevel}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setGameState((prev) => ({
                    ...prev,
                    difficultyLevel: Math.max(1, Math.min(10000, value)),
                  }));
                }}
              />
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    difficultyLevel: Math.min(10000, prev.difficultyLevel + 1),
                  }))
                }
              >
                +1
              </button>
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    difficultyLevel: Math.min(10000, prev.difficultyLevel + 10),
                  }))
                }
              >
                +10
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSidebar;
