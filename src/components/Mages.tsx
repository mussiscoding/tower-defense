import React, { useState } from "react";
import "./Mages.css";
import type { ElementData, Defender, MageProgress } from "../types/GameState";
import type { ElementType } from "../data/elements";
import { getXPForLevel } from "../data/elements";
import { allSkills } from "../data/allSkills";
import { getCurrentPrice } from "../data/shopItems";
import { allUpgrades } from "../data/upgrades";
import {
  getNextMageCost,
  canPurchaseMoreStars,
  getStarDamageMultiplier,
  getTotalStars,
} from "../utils/starSystem";
import { elements as elementConfigs } from "../data/elements";
import SkillsRow from "./SkillsRow";

interface MagesProps {
  elements: Record<ElementType, ElementData>;
  onPurchaseMage?: (elementType: ElementType) => void;
  onPurchaseUpgrade?: (itemId: string) => void;
  onPurchaseSkill?: (skillId: string) => void;
  currentGold?: number;
  purchases?: Record<string, number>;
  defenders?: Defender[];
  mageProgress?: Record<ElementType, MageProgress>;
}

const TIER_COLORS = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#ffd700",
} as const;

const Mages: React.FC<MagesProps> = ({
  elements,
  onPurchaseMage,
  onPurchaseUpgrade,
  onPurchaseSkill,
  currentGold = 0,
  purchases = {},
  defenders = [],
  mageProgress,
}) => {
  const defaultProgress: MageProgress = { stars: 1, tier: "bronze" };
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(
    null
  );
  const [elementTab, setElementTab] = useState<"stats" | "shop">("shop");

  const getXPProgress = (element: ElementData) => {
    const currentLevelXP = getXPForLevel(element.level);
    const nextLevelXP = getXPForLevel(element.level + 1);
    const currentXP = element.xp;

    // Calculate progress from current level XP to next level XP
    const xpForCurrentLevel = currentLevelXP;
    const xpForNextLevel = nextLevelXP;
    const xpProgress = currentXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;

    const progress = xpNeeded > 0 ? (xpProgress / xpNeeded) * 100 : 0;
    return Math.max(0, Math.min(progress, 100));
  };

  const getElementColor = (elementType: ElementType) => {
    switch (elementType) {
      case "fire":
        return "#ff4444";
      case "ice":
        return "#4444ff";
      case "earth":
        return "#8b4513";
      case "air":
        return "#cccccc";
      default:
        return "#666666";
    }
  };

  const getElementName = (elementType: ElementType) => {
    return elementType.charAt(0).toUpperCase() + elementType.slice(1);
  };

  const handleElementClick = (elementType: ElementType) => {
    setSelectedElement(elementType);
  };

  const handlePurchaseMage = (elementType: ElementType) => {
    if (onPurchaseMage) {
      onPurchaseMage(elementType);
    }
  };

  if (selectedElement) {
    const elementData = elements[selectedElement];

    // Get all purchased skills that unlock with this element
    const purchasedSkillsForElement = allSkills.filter((skill) => {
      // Check if skill has unlock requirement for this element AND is purchased
      const hasElementRequirement =
        skill.unlockRequirements[selectedElement] !== undefined;
      const isPurchased = purchases[skill.id] > 0;
      const hasStats = skill.statName && skill.statValue;

      return hasElementRequirement && isPurchased && hasStats;
    });

    // Create abilities object dynamically from skills
    const currentAbilities: Record<string, string | number> = {};
    purchasedSkillsForElement.forEach((skill) => {
      if (skill.statName && skill.statValue) {
        const value =
          typeof skill.statValue === "function"
            ? skill.statValue(purchases)
            : skill.statValue;
        currentAbilities[skill.statName] = value;
      }
    });
    return (
      <div className="mages-container">
        <div className="element-detail-header">
          <div className="element-nav-buttons">
            <button
              className={`element-nav-btn ${
                selectedElement === null ? "active" : ""
              }`}
              onClick={() => setSelectedElement(null)}
            >
              X
            </button>
            <button
              className={`element-nav-btn ${
                selectedElement === "fire" ? "active" : ""
              }`}
              onClick={() => setSelectedElement("fire")}
              disabled={selectedElement === "fire"}
            >
              F
            </button>
            <button
              className={`element-nav-btn ${
                selectedElement === "ice" ? "active" : ""
              }`}
              onClick={() => setSelectedElement("ice")}
              disabled={selectedElement === "ice"}
            >
              I
            </button>
            <button
              className={`element-nav-btn ${
                selectedElement === "earth" ? "active" : ""
              }`}
              onClick={() => setSelectedElement("earth")}
              disabled={selectedElement === "earth"}
            >
              E
            </button>
            <button
              className={`element-nav-btn ${
                selectedElement === "air" ? "active" : ""
              }`}
              onClick={() => setSelectedElement("air")}
              disabled={selectedElement === "air"}
            >
              A
            </button>
          </div>
        </div>

        <div className="element-detail-content">
          {/* Element Header with Icon and Name */}
          <div className="element-detail-header">
            <div
              className="element-icon-large"
              style={{ backgroundColor: getElementColor(selectedElement) }}
            >
              {selectedElement.charAt(0).toUpperCase()}
            </div>
            <div className="element-detail-info">
              <h2>{getElementName(selectedElement)}</h2>
              <div className="element-level">Level {elementData.level}</div>
              {mageProgress && (
                <div
                  className="element-stars"
                  style={{ color: TIER_COLORS[mageProgress[selectedElement].tier] }}
                >
                  {"★".repeat(mageProgress[selectedElement].stars)}
                  {"☆".repeat(5 - mageProgress[selectedElement].stars)}
                  {" "}{mageProgress[selectedElement].tier.charAt(0).toUpperCase() + mageProgress[selectedElement].tier.slice(1)}
                </div>
              )}
              <div className="element-xp-bar">
                <div
                  className="xp-progress"
                  style={{
                    width: `${getXPProgress(elementData)}%`,
                    backgroundColor: getElementColor(selectedElement),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Element Tab Navigation */}
          <div className="element-tabs">
            <button
              className={`element-tab-button ${
                elementTab === "shop" ? "active" : ""
              }`}
              onClick={() => setElementTab("shop")}
            >
              🛒 Shop
            </button>
            <button
              className={`element-tab-button ${
                elementTab === "stats" ? "active" : ""
              }`}
              onClick={() => setElementTab("stats")}
            >
              📊 Stats
            </button>
          </div>

          {elementTab === "stats" && (
            <>
              <div className="element-detail-stats">
                <div className="stat-grid">
                  <div className="stat-item">
                    <span className="stat-label">Base Damage:</span>
                    <span className="stat-value">
                      {elementConfigs[selectedElement].baseStats.damage}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Star Multiplier:</span>
                    <span className="stat-value">
                      {getStarDamageMultiplier(mageProgress?.[selectedElement] ?? defaultProgress).toLocaleString()}x
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Effective Damage:</span>
                    <span className="stat-value">
                      {elementData.baseStats.damage}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Attack Speed:</span>
                    <span className="stat-value">
                      {elementData.baseStats.attackSpeed.toFixed(1)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Range:</span>
                    <span className="stat-value">
                      {elementData.baseStats.range}
                    </span>
                  </div>
                  {/* Dynamically display purchased skill stats */}
                  {Object.entries(currentAbilities).map(
                    ([statName, statValue], index) => (
                      <div
                        key={statName}
                        className={`stat-item ${
                          index === Object.entries(currentAbilities).length - 1
                            ? "stat-item-last"
                            : ""
                        }`}
                      >
                        <span className="stat-label">{statName}:</span>
                        <span className="stat-value">{statValue}</span>
                      </div>
                    )
                  )}

                  <div className="stat-separator"></div>

                  <div className="stat-item">
                    <span className="stat-label">Total XP:</span>
                    <span className="stat-value">{elementData.xp}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">XP to Level:</span>
                    <span className="stat-value">
                      {getXPForLevel(elementData.level + 1) - elementData.xp}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {elementTab === "shop" && (
            <div className="element-shop-section">
              {/* Skills Row */}
              <SkillsRow
                elementType={selectedElement}
                elements={elements}
                currentGold={currentGold}
                purchases={purchases}
                onPurchaseSkill={onPurchaseSkill}
              />

              {/* Mage Purchase / Merge */}
              {(() => {
                const progress = mageProgress?.[selectedElement] ?? defaultProgress;
                const cost = getNextMageCost(progress);
                const canAfford = currentGold >= cost;
                const canBuyMore = canPurchaseMoreStars(progress);
                const magesOnField = defenders.filter(
                  (d) => d.type === selectedElement
                ).length;
                const canPurchase = canAfford && canBuyMore;

                // Determine action label
                let actionLabel: string;
                if (magesOnField === 0) {
                  actionLabel = "Hire Mage";
                } else if (magesOnField === 1) {
                  actionLabel = "Hire 2nd Mage";
                } else {
                  const next = getTotalStars(progress) + 1;
                  const nextTier = next > 10 ? "Gold" : next > 5 ? "Silver" : "Bronze";
                  const nextStars = ((next - 1) % 5) + 1;
                  actionLabel = `Merge -> ${nextStars} ${nextTier} Star${nextStars > 1 ? "s" : ""}`;
                }

                // Star display
                const totalStars = getTotalStars(progress);
                const tierColor = TIER_COLORS[progress.tier];

                return (
                  <div
                    className={`shop-item ${!canPurchase ? "disabled" : ""}`}
                    onClick={() =>
                      canPurchase && handlePurchaseMage(selectedElement)
                    }
                  >
                    <h5 className="shop-item-name">
                      {actionLabel} - 💰{cost}
                    </h5>
                    <div className="mage-count-info">
                      <span className="mage-count" style={{ color: tierColor }}>
                        {"★".repeat(progress.stars)}{"☆".repeat(5 - progress.stars)}
                        {" "}{progress.tier.charAt(0).toUpperCase() + progress.tier.slice(1)}
                      </span>
                      <span className="star-info">
                        {totalStars}/15 total stars | {getStarDamageMultiplier(progress).toLocaleString()}x damage
                      </span>
                    </div>
                    {!canBuyMore && (
                      <p className="shop-item-description">Max tier reached!</p>
                    )}
                  </div>
                );
              })()}

              {/* Element-specific upgrades */}
              {allUpgrades
                .filter((item) => {
                  const matchesElement = item.id.startsWith(selectedElement);

                  const hasPrerequisite =
                    !item.prerequisiteSkill ||
                    (purchases[item.prerequisiteSkill] || 0) > 0;

                  return matchesElement && hasPrerequisite;
                })
                .map((item) => {
                  const cost = getCurrentPrice(item, purchases);
                  const canAfford = currentGold >= cost;
                  return (
                    <div
                      key={item.id}
                      className={`shop-item ${!canAfford ? "disabled" : ""}`}
                      onClick={() => canAfford && onPurchaseUpgrade?.(item.id)}
                    >
                      <h5 className="shop-item-name">
                        {item.name} - 💰{cost}
                      </h5>
                      <p className="shop-item-description">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mages-container">
      <h2>Mages</h2>
      <div className="elements-overview">
        {Object.entries(elements).map(([elementType, elementData]) => (
          <div
            key={elementType}
            className="element-card clickable"
            onClick={() => handleElementClick(elementType as ElementType)}
          >
            <div className="element-header">
              <div
                className="element-icon"
                style={{
                  backgroundColor: getElementColor(elementType as ElementType),
                }}
              >
                {elementType.charAt(0).toUpperCase()}
              </div>
              <div className="element-info">
                <h3>{getElementName(elementType as ElementType)}</h3>
                <div className="element-level">Level {elementData.level}</div>
                {mageProgress && (
                  <div
                    className="element-stars"
                    style={{ color: TIER_COLORS[mageProgress[elementType as ElementType].tier] }}
                  >
                    {"★".repeat(mageProgress[elementType as ElementType].stars)}
                    {"☆".repeat(5 - mageProgress[elementType as ElementType].stars)}
                  </div>
                )}
              </div>
            </div>

            <div className="xp-section">
              <div className="xp-bar-container">
                <div className="xp-bar">
                  <div
                    className="xp-progress"
                    style={{
                      width: `${getXPProgress(elementData)}%`,
                      backgroundColor: getElementColor(
                        elementType as ElementType
                      ),
                    }}
                  />
                </div>
                <div className="xp-tooltip">
                  XP: {elementData.xp} / {getXPForLevel(elementData.level + 1)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mages;
