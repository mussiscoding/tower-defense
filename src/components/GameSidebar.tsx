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
  stateRef: React.MutableRefObject<GameState>;
  triggerRender: () => void;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  stateRef,
  triggerRender,
}) => {
  const handleSkillPurchase = (skillId: string) => {
    const newState = purchaseSkill(stateRef.current, skillId);
    stateRef.current = newState;
    triggerRender();
  };

  const handlePurchase = (itemId: string) => {
    const state = stateRef.current;
    const item = shopItems.find((shopItem) => shopItem.id === itemId);
    const currentPrice = getCurrentPrice(item!, state.purchases);
    if (!item || state.gold < currentPrice) return;

    // Handle click damage upgrade (special case)
    if (itemId === "click_damage_upgrade") {
      state.gold -= currentPrice;
      state.clickDamage += 1;
      state.purchases = {
        ...state.purchases,
        [itemId]: (state.purchases[itemId] || 0) + 1,
      };
      triggerRender();
      return;
    }

    // Handle upgrade shop items (they define their own effects)
    const upgradeItem = allUpgrades.find((upgrade) => upgrade.id === itemId);
    if (upgradeItem) {
      const updatedState = upgradeItem.effect(state);

      // Determine the element type from the upgrade ID
      const elementType = itemId.split("_")[0] as ElementType;

      // Find all mages of this element type to get their positions
      const magesOfType = state.defenders.filter(
        (defender) => defender.type === elementType
      );

      // Create fireworks animation and floating text for each mage of this element type
      const newUpgradeAnimations = magesOfType.map((mage) => {
        return createUpgradeAnimation(
          upgradeItem.shortName || item.name,
          elementType,
          mage.x - 5,
          mage.y - 5,
          Date.now()
        );
      });

      // Create floating texts for each mage
      const newFloatingTexts = magesOfType.map((mage) => {
        return createFloatingText(
          upgradeItem.shortName || item.name,
          mage.x + 20,
          mage.y - 2,
          elementType,
          Date.now()
        );
      });

      // Update state
      stateRef.current = {
        ...updatedState,
        gold: state.gold - currentPrice,
        purchases: {
          ...updatedState.purchases,
          [itemId]: (state.purchases[itemId] || 0) + 1,
        },
        upgradeAnimations: [
          ...(state.upgradeAnimations || []),
          ...newUpgradeAnimations,
        ],
        floatingTexts: [...state.floatingTexts, ...newFloatingTexts],
      };
      triggerRender();
    }
  };

  const handlePurchaseMage = (elementType: ElementType, cost: number) => {
    const state = stateRef.current;
    const elementLevel = state.elements[elementType]?.level || 1;
    const canPurchase = canPurchaseMage(
      state.defenders,
      elementType,
      elementLevel
    );

    if (state.gold >= cost && canPurchase) {
      const smartY = getBisectingDefenderPosition(state.defenders);
      state.gold -= cost;
      state.defenders = [
        ...state.defenders,
        createDefender(GAME_DIMENSIONS.DEFENDER_SPAWN_X, smartY, elementType),
      ];
      state.purchases = {
        ...state.purchases,
        [elementType]: (state.purchases[elementType] || 0) + 1,
      };
      triggerRender();
    }
  };

  const handleDifficultyChange = (delta: number) => {
    const state = stateRef.current;
    state.difficultyLevel = Math.max(1, Math.min(10000, state.difficultyLevel + delta));
    triggerRender();
  };

  const handleDifficultyInput = (value: number) => {
    stateRef.current.difficultyLevel = Math.max(1, Math.min(10000, value));
    triggerRender();
  };

  // Read current state for rendering
  const gameState = stateRef.current;

  return (
    <div className="game-sidebar">
      <div className="sidebar-section">
        <Mages
          elements={gameState.elements}
          currentGold={gameState.gold}
          purchases={gameState.purchases}
          defenders={gameState.defenders}
          onPurchaseMage={handlePurchaseMage}
          onPurchaseUpgrade={handlePurchase}
          onPurchaseSkill={handleSkillPurchase}
        />
      </div>

      <div className="sidebar-section">
        <h3>Difficulty Controls</h3>
        <div className="difficulty-controls">
          <div className="control-group">
            <label htmlFor="difficulty">Difficulty Level</label>
            <div className="difficulty-input">
              <button onClick={() => handleDifficultyChange(-10)}>-10</button>
              <button onClick={() => handleDifficultyChange(-1)}>-1</button>
              <input
                type="number"
                min="1"
                max="10000"
                value={gameState.difficultyLevel}
                onChange={(e) =>
                  handleDifficultyInput(parseInt(e.target.value) || 1)
                }
              />
              <button onClick={() => handleDifficultyChange(1)}>+1</button>
              <button onClick={() => handleDifficultyChange(10)}>+10</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSidebar;
