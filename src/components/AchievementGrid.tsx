import { useState, useRef, useCallback } from "react";
import type { GameState } from "../types/GameStateSlices";
import { achievements, type AchievementDef } from "../data/achievements";
import "./AchievementGrid.css";

interface AchievementGridProps {
  state: GameState;
}

interface DisplaySlot {
  def: AchievementDef;
  unlocked: boolean;
  unlockedAt: number;
  progress: { current: number; target: number } | null;
}

const getDisplaySlots = (state: GameState): DisplaySlot[] => {
  const unlocked = state.core.achievements;
  const slots: DisplaySlot[] = [];
  const processedGroups = new Set<string>();

  for (const def of achievements) {
    // For tiered achievements, only show the current tier
    if (def.tieredGroup) {
      if (processedGroups.has(def.tieredGroup)) continue;
      processedGroups.add(def.tieredGroup);

      // Find the highest unlocked tier in this group
      const tiered = achievements
        .filter((a) => a.tieredGroup === def.tieredGroup)
        .sort((a, b) => (a.tieredOrder ?? 0) - (b.tieredOrder ?? 0));

      let displayDef: AchievementDef | null = null;
      let isUnlocked = false;
      let unlockedAt = 0;

      // Find highest unlocked tier
      for (let i = tiered.length - 1; i >= 0; i--) {
        if (unlocked[tiered[i].id]) {
          displayDef = tiered[i];
          isUnlocked = true;
          unlockedAt = unlocked[tiered[i].id];
          break;
        }
      }

      if (!displayDef) {
        // Nothing unlocked - show first tier as in-progress
        displayDef = tiered[0];
      } else {
        // Check if there's a next tier to show instead
        const currentIdx = tiered.indexOf(displayDef);
        if (currentIdx < tiered.length - 1) {
          // Show the next tier as in-progress
          displayDef = tiered[currentIdx + 1];
          isUnlocked = false;
          unlockedAt = 0;
        }
      }

      const progress = !isUnlocked && displayDef.getProgress
        ? displayDef.getProgress(state)
        : null;

      slots.push({ def: displayDef, unlocked: isUnlocked, unlockedAt, progress });
    } else {
      const isUnlocked = !!unlocked[def.id];
      const unlockedAt = unlocked[def.id] || 0;
      const progress = !isUnlocked && def.getProgress ? def.getProgress(state) : null;
      slots.push({ def, unlocked: isUnlocked, unlockedAt, progress });
    }
  }

  // Sort: unlocked (recent first) -> in-progress (by %) -> locked -> hidden
  slots.sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    if (a.unlocked && b.unlocked) return b.unlockedAt - a.unlockedAt;
    // Both locked
    const aHasProgress = a.progress && a.progress.current > 0;
    const bHasProgress = b.progress && b.progress.current > 0;
    if (aHasProgress && !bHasProgress) return -1;
    if (!aHasProgress && bHasProgress) return 1;
    if (aHasProgress && bHasProgress) {
      return (b.progress!.current / b.progress!.target) - (a.progress!.current / a.progress!.target);
    }
    // Both no progress: visible before hidden
    if (!a.def.hidden && b.def.hidden) return -1;
    if (a.def.hidden && !b.def.hidden) return 1;
    return 0;
  });

  return slots;
};

const formatProgress = (current: number, target: number): string => {
  if (target >= 1000) {
    const formatK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
    return `${formatK(current)} / ${formatK(target)}`;
  }
  return `${current} / ${target}`;
};

const AchievementGrid: React.FC<AchievementGridProps> = ({ state }) => {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalUnlocked = Object.keys(state.core.achievements).length;
  const slots = getDisplaySlots(state);

  const tooltipWidth = 160; // matches width in CSS

  const showTooltip = useCallback((id: string, slotEl: HTMLElement) => {
    setTooltip(id);
    const slotRect = slotEl.getBoundingClientRect();
    const sidebarEl = containerRef.current?.closest(".game-sidebar") as HTMLElement | null;
    const sidebarRect = sidebarEl?.getBoundingClientRect();
    if (!sidebarRect) return;

    // Start centered above the slot
    let left = slotRect.left + slotRect.width / 2 - tooltipWidth / 2;

    // Clamp RHS only: don't overflow the sidebar's right edge
    const maxLeft = sidebarRect.right - tooltipWidth - 8; // 8px padding
    if (left > maxLeft) left = maxLeft;

    setTooltipPos({
      top: slotRect.top - 8,
      left,
    });
  }, []);

  return (
    <div className="achievement-grid-container" ref={containerRef}>
      <h3>Achievements ({totalUnlocked}/{achievements.length})</h3>
      <div className="achievement-grid">
        {slots.map((slot) => {
          const { def, unlocked, progress } = slot;
          const isHidden = def.hidden && !unlocked;
          const progressPercent = progress
            ? Math.min((progress.current / progress.target) * 100, 100)
            : 0;

          return (
            <div
              key={def.id}
              className={`achievement-slot ${unlocked ? "unlocked" : ""} ${isHidden ? "hidden-achievement" : ""}`}
              onMouseEnter={(e) => showTooltip(def.id, e.currentTarget)}
              onMouseLeave={() => setTooltip(null)}
              onClick={(e) => {
                if (tooltip === def.id) {
                  setTooltip(null);
                } else {
                  showTooltip(def.id, e.currentTarget);
                }
              }}
            >
              {/* Progress ring */}
              {!unlocked && progress && progress.current > 0 && (
                <svg className="progress-ring" viewBox="0 0 40 40">
                  <circle
                    className="progress-ring-bg"
                    cx="20" cy="20" r="18"
                    fill="none" stroke="rgba(139, 69, 19, 0.4)" strokeWidth="2"
                  />
                  <circle
                    className="progress-ring-fill"
                    cx="20" cy="20" r="18"
                    fill="none" stroke="#ffd700" strokeWidth="2"
                    strokeDasharray={`${(progressPercent / 100) * 113} 113`}
                    strokeLinecap="round"
                    transform="rotate(-90 20 20)"
                  />
                </svg>
              )}
              <span className="achievement-slot-icon">
                {isHidden ? "?" : def.icon}
              </span>

            </div>
          );
        })}
      </div>
      {tooltip && tooltipPos && (() => {
        const slot = slots.find((s) => s.def.id === tooltip);
        if (!slot) return null;
        const { def, unlocked, progress } = slot;
        const isHidden = def.hidden && !unlocked;
        return (
          <div
            className="achievement-tooltip"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translateY(-100%)",
            }}
          >
            <div className="achievement-tooltip-name">
              {isHidden ? "???" : def.name}
            </div>
            {unlocked && (
              <div className="achievement-tooltip-desc">{def.description}</div>
            )}
            {!unlocked && !isHidden && def.hint && (
              <div className="achievement-tooltip-hint">{def.hint}</div>
            )}
            {isHidden && (
              <div className="achievement-tooltip-hint">Hidden achievement</div>
            )}
            {unlocked && (
              <div className="achievement-tooltip-reward">
                Earned: +{def.reward}g
              </div>
            )}
            {!unlocked && !isHidden && (
              <div className="achievement-tooltip-reward">
                Reward: {def.reward}g
              </div>
            )}
            {progress && progress.current > 0 && !unlocked && (
              <div className="achievement-tooltip-progress">
                {formatProgress(progress.current, progress.target)}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default AchievementGrid;
