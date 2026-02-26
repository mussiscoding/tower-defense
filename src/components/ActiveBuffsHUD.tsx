import React from "react";
import type { ActivePowerUp } from "../types/GameStateSlices";
import { getPowerUpDef, getPowerUpColor } from "../data/powerups";
import "./ActiveBuffsHUD.css";

interface ActiveBuffsHUDProps {
  activePowerUps: ActivePowerUp[];
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ActiveBuffsHUD: React.FC<ActiveBuffsHUDProps> = ({ activePowerUps }) => {
  if (activePowerUps.length === 0) return null;

  const now = Date.now();

  return (
    <div className="active-buffs-hud">
      {activePowerUps.map((buff) => {
        const def = getPowerUpDef(buff.powerUpId);
        if (!def) return null;

        const remaining = Math.max(0, buff.startTime + buff.duration - now);
        const seconds = Math.ceil(remaining / 1000);
        const color = getPowerUpColor(buff.powerUpId, buff.elementType);

        // Build tooltip: include element name for element-specific buffs
        let tooltip = def.description;
        if (buff.elementType) {
          tooltip = tooltip.replace("one random element", capitalize(buff.elementType));
          tooltip = tooltip.replace("lowest-level element", capitalize(buff.elementType));
        }

        return (
          <div
            key={buff.id}
            className="buff-indicator"
            style={{ ["--glow-color" as string]: color }}
          >
            <div className="buff-icon">{def.icon}</div>
            <div className="buff-timer">{seconds}s</div>
            <div className="buff-tooltip">{tooltip}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ActiveBuffsHUD;
