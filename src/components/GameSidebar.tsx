import type { GameState } from "../types/GameStateSlices";
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
import { purchaseSkillSliced } from "../utils/skillUtils";

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
    purchaseSkillSliced(stateRef.current, skillId);
    triggerRender();
  };

  const handlePurchase = (itemId: string) => {
    const state = stateRef.current;
    const item = shopItems.find((shopItem) => shopItem.id === itemId);
    const currentPrice = getCurrentPrice(item!, state.core.purchases);
    if (!item || state.core.gold < currentPrice) return;

    // Handle click damage upgrade (special case)
    if (itemId === "click_damage_upgrade") {
      state.core.gold -= currentPrice;
      state.core.clickDamage += 1;
      state.core.purchases = {
        ...state.core.purchases,
        [itemId]: (state.core.purchases[itemId] || 0) + 1,
      };
      triggerRender();
      return;
    }

    // Handle upgrade shop items
    const upgradeItem = allUpgrades.find((upgrade) => upgrade.id === itemId);
    if (upgradeItem) {
      // Determine the element type from the upgrade ID
      const elementType = itemId.split("_")[0] as ElementType;

      // Find all mages of this element type to get their positions
      const magesOfType = state.entities.defenders.filter(
        (defender) => defender.type === elementType
      );

      // Create fireworks animation and floating text for each mage
      const newUpgradeAnimations = magesOfType.map((mage) => {
        return createUpgradeAnimation(
          upgradeItem.shortName || item.name,
          elementType,
          mage.x - 5,
          mage.y - 5,
          Date.now()
        );
      });

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
      state.core.gold -= currentPrice;
      state.core.purchases = {
        ...state.core.purchases,
        [itemId]: (state.core.purchases[itemId] || 0) + 1,
      };
      state.visuals.upgradeAnimations = [
        ...state.visuals.upgradeAnimations,
        ...newUpgradeAnimations,
      ];
      state.visuals.floatingTexts = [
        ...state.visuals.floatingTexts,
        ...newFloatingTexts,
      ];
      triggerRender();
    }
  };

  const handlePurchaseMage = (elementType: ElementType, cost: number) => {
    const state = stateRef.current;
    const elementLevel = state.core.elements[elementType]?.level || 1;
    const canPurchase = canPurchaseMage(
      state.entities.defenders,
      elementType,
      elementLevel
    );

    if (state.core.gold >= cost && canPurchase) {
      const smartY = getBisectingDefenderPosition(state.entities.defenders);
      state.core.gold -= cost;
      state.entities.defenders = [
        ...state.entities.defenders,
        createDefender(GAME_DIMENSIONS.DEFENDER_SPAWN_X, smartY, elementType),
      ];
      state.core.purchases = {
        ...state.core.purchases,
        [elementType]: (state.core.purchases[elementType] || 0) + 1,
      };
      triggerRender();
    }
  };

  const handleDifficultyChange = (delta: number) => {
    const state = stateRef.current;
    state.core.difficultyLevel = Math.max(
      1,
      Math.min(10000, state.core.difficultyLevel + delta)
    );
    triggerRender();
  };

  const handleDifficultyInput = (value: number) => {
    stateRef.current.core.difficultyLevel = Math.max(1, Math.min(10000, value));
    triggerRender();
  };

  // Read current state for rendering
  const { core, entities } = stateRef.current;

  return (
    <div className="game-sidebar">
      <div className="sidebar-section">
        <Mages
          elements={core.elements}
          currentGold={core.gold}
          purchases={core.purchases}
          defenders={entities.defenders}
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
                value={core.difficultyLevel}
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
