import React, { useState } from "react";
import "./SkillsRow.css";
import type { ElementData, Skill, SkillState } from "../types/GameState";
import type { ElementType } from "../data/elements";
import { getSkillStatesForElement } from "../utils/skillUtils";
import { formatNumber } from "../utils/formatNumber";

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
          return (
            <div
              key={skill.id}
              className={`skill-icon ${state} ${
                state === "purchaseable" ? "clickable" : ""
              }`}
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
              <span className="skill-number">
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
                        💰 {formatNumber(skill.cost)}
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
