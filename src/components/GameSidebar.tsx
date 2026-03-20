import { useState } from "react";
import type { GameState } from "../types/GameStateSlices";
import type { ElementType } from "../data/elements";
import type { MergeAnimation } from "../types/GameState";
import { shopItems, getCurrentPrice } from "../data/shopItems";
import { allUpgrades, getStrongestMageDamage } from "../data/upgrades";
import { createDefender } from "../utils/gameLogic/defender";
import {
  createUpgradeAnimation,
  createFloatingText,
} from "../utils/gameLogic/uiUtils";
import { GAME_DIMENSIONS, MAGE_POSITIONS } from "../constants/gameDimensions";
import { purchaseSkillSliced } from "../utils/skillUtils";
import { advanceStar, getStarUpgradeCost, getTrainMageCost } from "../utils/starSystem";
import { recalculateElementDamage } from "../utils/gameLogic/mutations";

import { tryUnlockAchievement } from "../utils/achievementUtils";
import AchievementGrid from "./AchievementGrid";
import "./GameSidebar.css";
import Mages from "./Mages";

type SidebarTab = "mages" | "stats";

interface GameSidebarProps {
  stateRef: React.MutableRefObject<GameState>;
  triggerRender: () => void;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  stateRef,
  triggerRender,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>("mages");

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSkillPurchase = (skillId: string) => {
    purchaseSkillSliced(stateRef.current, skillId);
    triggerRender();
  };

  const handlePurchase = (itemId: string) => {
    const state = stateRef.current;
    const item = shopItems.find((shopItem) => shopItem.id === itemId);
    const currentPrice = getCurrentPrice(item!, state.core.purchases);
    if (!item || state.core.gold < currentPrice) return;

    // Handle Empower Click upgrade
    if (itemId === "empower_click") {
      const strongestDamage = getStrongestMageDamage(state.core.elements, state.core.mageProgress);
      if (strongestDamage <= 0) return; // No mages yet
      state.core.gold -= currentPrice;
      state.core.totalGoldSpent += currentPrice;
      state.core.clickDamage = Math.floor(strongestDamage / 2);
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
      state.core.totalGoldSpent += currentPrice;
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

  const handlePurchaseMage = (elementType: ElementType) => {
    const state = stateRef.current;
    const progress = state.core.mageProgress[elementType];
    const magesOfType = state.entities.defenders.filter(
      (d) => d.type === elementType
    );
    const count = magesOfType.length;
    const cost = count >= 2 ? getStarUpgradeCost(progress) : getTrainMageCost(progress);

    if (state.core.gold < cost) return;

    const positions = MAGE_POSITIONS[elementType];
    const spawnX = GAME_DIMENSIONS.DEFENDER_SPAWN_X;

    state.core.gold -= cost;
    state.core.totalGoldSpent += cost;

    if (count === 0) {
      // First mage: place at center
      state.entities.defenders = [
        ...state.entities.defenders,
        createDefender(spawnX, positions.center, elementType),
      ];
    } else if (count === 1) {
      // Second mage: reposition existing to slot1, create new at slot2
      magesOfType[0].y = positions.slot1;
      state.entities.defenders = [
        ...state.entities.defenders,
        createDefender(spawnX, positions.slot2, elementType),
      ];
    } else {
      // Merge: remove one, reposition survivor to center, advance star
      state.core.totalMerges++;
      const fromPositions = magesOfType.map((d) => ({ x: d.x, y: d.y }));
      const toPosition = { x: spawnX, y: positions.center };

      // Remove the second defender
      state.entities.defenders = state.entities.defenders.filter(
        (d) => d.id !== magesOfType[1].id
      );
      // Reposition survivor to center and reset attack state
      magesOfType[0].y = positions.center;
      magesOfType[0].skillCooldowns = {};
      magesOfType[0].lastAttack = 0;

      // Advance star
      const newProgress = advanceStar(progress);
      state.core.mageProgress[elementType] = newProgress;

      // Recalculate element damage with new star multiplier
      recalculateElementDamage(
        state.core.elements,
        elementType,
        newProgress
      );

      // Create merge animation
      const mergeAnim: MergeAnimation = {
        id: `merge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        elementType,
        fromPositions,
        toPosition,
        startTime: Date.now(),
        duration: 1000,
        resultStars: newProgress.stars,
        resultTier: newProgress.tier,
      };
      state.visuals.mergeAnimations = [
        ...state.visuals.mergeAnimations,
        mergeAnim,
      ];
    }

    state.core.purchases = {
      ...state.core.purchases,
      [elementType]: (state.core.purchases[elementType] || 0) + 1,
    };
    triggerRender();
  };

  // Read current state for rendering
  const { core, entities } = stateRef.current;

  return (
    <div className="game-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === "mages" ? "active" : ""}`}
          onClick={() => setActiveTab("mages")}
        >
          🧙 Mages
        </button>
        <button
          className={`sidebar-tab ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("stats");
            tryUnlockAchievement("stats_man", stateRef.current);
            triggerRender();
          }}
        >
          📊 Stats
        </button>
      </div>

      {activeTab === "mages" && (
        <div className="sidebar-content">
          <Mages
            elements={core.elements}
            currentGold={core.gold}
            purchases={core.purchases}
            defenders={entities.defenders}
            mageProgress={core.mageProgress}
            onPurchaseMage={handlePurchaseMage}
            onPurchaseUpgrade={handlePurchase}
            onPurchaseSkill={handleSkillPurchase}
          />
        </div>
      )}

      {activeTab === "stats" && (
        <div className="sidebar-content stats-content">
          <div className="stats-section">
            <h3>Game Stats</h3>
            <div className="stat-row">
              <span className="stat-icon">⏱️</span>
              <span className="stat-label">Time Played:</span>
              <span className="stat-value">{formatTime(core.timeSurvived)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-icon">💾</span>
              <span className="stat-label">Last Save:</span>
              <span className="stat-value">
                {new Date(core.lastSave).toLocaleTimeString()}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-icon">🖱️</span>
              <span className="stat-label">Click Damage:</span>
              <span className="stat-value">{core.clickDamage}</span>
            </div>
          </div>

          <div className="stats-section">
            <AchievementGrid state={stateRef.current} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSidebar;
