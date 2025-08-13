import React, { useState } from "react";
import "./SkillsRow.css";
import type { ElementData, Skill, SkillState } from "../types/GameState";
import type { ElementType } from "../data/elements";
import { getSkillStatesForElement } from "../utils/skillUtils";

interface SkillsRowProps {
  elementType: ElementType;
  elements: Record<ElementType, ElementData>;
  currentGold: number;
  purchases: Record<string, number>;
  onPurchaseSkill?: (skillId: string) => void;
}

const SkillsRow: React.FC<SkillsRowProps> = ({
  elementType,
  elements,
  currentGold,
  purchases,
  onPurchaseSkill,
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const skillStates = getSkillStatesForElement(
    elementType,
    elements,
    currentGold,
    purchases
  );

  // Pad to 10 skills for consistent UI (empty slots if fewer skills)
  const paddedSkillStates: Array<{ skill: Skill; state: SkillState } | null> = [
    ...skillStates,
  ];
  while (paddedSkillStates.length < 10) {
    paddedSkillStates.push(null);
  }

  const getSkillStateColor = (state: string) => {
    switch (state) {
      case "purchaseable":
        return "#22c55e"; // Green
      case "insufficient_gold":
        return "#d1d5db"; // Light gray
      case "locked":
        return "#374151"; // Dark gray
      case "purchased":
        return "#eab308"; // Yellow
      default:
        return "#374151"; // Dark gray for empty slots
    }
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

  const handleSkillClick = (skillId: string, state: string) => {
    if (state === "purchaseable" && onPurchaseSkill) {
      onPurchaseSkill(skillId);
    }
  };

  return (
    <div className="skills-row">
      <div className="skills-header">
        <span className="skills-title">Skills</span>
      </div>
      <div className="skills-icons">
        {paddedSkillStates.map((skillState, index) => {
          if (!skillState) {
            // Empty skill slot
            return (
              <div key={index} className="skill-icon empty">
                <span className="skill-number">—</span>
              </div>
            );
          }

          const { skill, state } = skillState;
          const stateColor = getSkillStateColor(state);
          const elementColor = getElementColor(elementType);

          return (
            <div
              key={skill.id}
              className={`skill-icon ${state} ${
                state === "purchaseable" ? "clickable" : ""
              }`}
              style={{ backgroundColor: stateColor }}
              onClick={() => handleSkillClick(skill.id, state)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPopupPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                });
                setHoveredSkill(skill.id);
              }}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <span className="skill-number" style={{ color: elementColor }}>
                {skill.icon}
              </span>

              {/* Hover popup */}
              {hoveredSkill === skill.id && (
                <div
                  className="skill-popup"
                  style={{
                    left: `${popupPosition.x}px`,
                    top: `${popupPosition.y}px`,
                    transform: "translateX(-50%) translateY(-100%)",
                  }}
                >
                  <div className="skill-popup-content">
                    <div className="skill-popup-header">
                      <span
                        className="skill-popup-icon"
                        style={{ color: elementColor }}
                      >
                        {skill.icon}
                      </span>
                      <span className="skill-popup-name">{skill.name}</span>
                    </div>

                    <div className="skill-popup-requirements">
                      {Object.entries(skill.unlockRequirements).map(
                        ([element, level]) => {
                          const currentLevel =
                            elements[element as ElementType]?.level || 0;
                          const requiredLevel = Number(level);
                          const isMet = currentLevel >= requiredLevel;
                          return (
                            <span
                              key={element}
                              className={`requirement ${
                                isMet ? "met" : "not-met"
                              }`}
                            >
                              {element.charAt(0).toUpperCase() +
                                element.slice(1)}{" "}
                              {requiredLevel}
                              {isMet ? " ✓" : ""}
                            </span>
                          );
                        }
                      )}
                    </div>

                    {state !== "purchased" && (
                      <div className="skill-popup-cost">
                        💰 {skill.cost.toLocaleString()}
                      </div>
                    )}

                    <div className="skill-popup-description">
                      {skill.description}
                    </div>

                    {/* Show skill stats if available */}
                    {skill.statName && skill.statValue && (
                      <div className="skill-popup-stats">
                        <strong>{skill.statName}:</strong>{" "}
                        {typeof skill.statValue === "function"
                          ? skill.statValue(purchases)
                          : skill.statValue}
                      </div>
                    )}

                    <div className="skill-popup-state">
                      {state === "purchaseable" && "Click to purchase!"}
                      {state === "insufficient_gold" && "Need more gold"}
                      {state === "locked" && "Level requirements not met"}
                      {state === "purchased" && "Purchased ✓"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsRow;
