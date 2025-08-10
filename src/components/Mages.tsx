import React, { useState } from "react";
import "./Mages.css";
import type { ElementData } from "../types/GameState";
import type { ElementType } from "../data/elements";
import { getXPForLevel, calculateElementAbilities } from "../data/elements";
import { getDefenderData } from "../data/defenders";
import { getCurrentPrice } from "../data/shopItems";
import { upgradeShopItems } from "../data/upgrades";
import type { ShopItem } from "../types/GameState";

interface MagesProps {
  elements: Record<ElementType, ElementData>;
  onPurchaseMage?: (elementType: ElementType, cost: number) => void;
  onPurchaseUpgrade?: (itemId: string) => void;
  currentGold?: number;
  purchases?: Record<string, number>;
}

const Mages: React.FC<MagesProps> = ({
  elements,
  onPurchaseMage,
  onPurchaseUpgrade,
  currentGold = 0,
  purchases = {},
}) => {
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(
    null
  );
  const [elementTab, setElementTab] = useState<"stats" | "shop">("stats");

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
      const defenderData = getDefenderData(elementType);
      if (defenderData) {
        const shopItem: ShopItem = {
          id: defenderData.id,
          name: defenderData.name,
          description: defenderData.description,
          cost: defenderData.cost,
          type: "defender",
          costScalingFactor: defenderData.costScalingFactor,
        };
        const cost = getCurrentPrice(shopItem, purchases);
        onPurchaseMage(elementType, cost);
      }
    }
  };

  if (selectedElement) {
    const elementData = elements[selectedElement];
    const currentAbilities = calculateElementAbilities(
      selectedElement,
      purchases
    );
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
                elementTab === "stats" ? "active" : ""
              }`}
              onClick={() => setElementTab("stats")}
            >
              📊 Stats
            </button>
            <button
              className={`element-tab-button ${
                elementTab === "shop" ? "active" : ""
              }`}
              onClick={() => setElementTab("shop")}
            >
              🛒 Shop
            </button>
          </div>

          {elementTab === "stats" && (
            <>
              <div className="element-detail-stats">
                <div className="stat-grid">
                  <div className="stat-item">
                    <span className="stat-label">Damage:</span>
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
                  {selectedElement === "fire" && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Burn Damage:</span>
                        <span className="stat-value">
                          {currentAbilities.burnDamagePercent || 0}%
                        </span>
                      </div>
                      <div className="stat-item stat-item-last">
                        <span className="stat-label">Burn Duration:</span>
                        <span className="stat-value">
                          {currentAbilities.burnDuration || 0}s
                        </span>
                      </div>
                    </>
                  )}
                  {selectedElement === "ice" && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Slow Effect:</span>
                        <span className="stat-value">
                          {currentAbilities.slowEffect || 0}%
                        </span>
                      </div>
                      <div className="stat-item stat-item-last">
                        <span className="stat-label">Slow Duration:</span>
                        <span className="stat-value">
                          {currentAbilities.slowDuration || 0}s
                        </span>
                      </div>
                    </>
                  )}
                  {selectedElement === "earth" && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Splash Damage:</span>
                        <span className="stat-value">
                          {currentAbilities.splashDamage || 0}%
                        </span>
                      </div>
                      <div className="stat-item stat-item-last">
                        <span className="stat-label">Splash Radius:</span>
                        <span className="stat-value">
                          {currentAbilities.splashRadius || 0}px
                        </span>
                      </div>
                    </>
                  )}
                  {selectedElement === "air" && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Burst Shots:</span>
                        <span className="stat-value">
                          {currentAbilities.burstShots || 0}
                        </span>
                      </div>
                      <div className="stat-item stat-item-last">
                        <span className="stat-label">Burst Cooldown:</span>
                        <span className="stat-value">
                          {currentAbilities.burstCooldown || 0}s
                        </span>
                      </div>
                    </>
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
              {/* Mage Purchase */}
              {(() => {
                const defenderData = getDefenderData(selectedElement);
                if (defenderData) {
                  const shopItem: ShopItem = {
                    id: defenderData.id,
                    name: defenderData.name,
                    description: defenderData.description,
                    cost: defenderData.cost,
                    type: "defender",
                    costScalingFactor: defenderData.costScalingFactor,
                  };
                  const cost = getCurrentPrice(shopItem, purchases);
                  const canAfford = currentGold >= cost;
                  return (
                    <div
                      className={`shop-item ${!canAfford ? "disabled" : ""}`}
                      onClick={() =>
                        canAfford && handlePurchaseMage(selectedElement)
                      }
                    >
                      <h5 className="shop-item-name">
                        {defenderData.name} - 💰{cost}
                      </h5>
                      <p className="shop-item-description">
                        {defenderData.description}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Element-specific upgrades */}
              {upgradeShopItems
                .filter((item) => item.id.startsWith(selectedElement))
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
