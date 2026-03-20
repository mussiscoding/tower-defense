import React, { useState, useEffect } from "react";
import type { Enemy as EnemyType } from "../types/GameState";
import BurnDamageNumber from "./BurnDamageNumber";
import FireParticles from "./FireParticles";
import IceBlockEffect from "./IceBlockEffect";
import EnemySprite from "./EnemySprite";
import "./Enemy.css";

interface EnemyProps {
  enemy: EnemyType;
  onClick: (enemy: EnemyType) => void;
  isPaused: boolean;
}

const Enemy: React.FC<EnemyProps> = ({ enemy, onClick, isPaused }) => {
  const healthPercentage = (enemy.health / enemy.maxHealth) * 100;
  const [burnDamageNumbers, setBurnDamageNumbers] = useState<
    Array<{
      id: string;
      damage: number;
      x: number;
      y: number;
    }>
  >([]);

  // Check for burn damage ticks and show damage numbers
  useEffect(() => {
    if (enemy.burnDamage && enemy.burnEndTime) {
      const currentTime = Date.now();
      const burnTickInterval = 500;
      const burnStartTime = enemy.burnEndTime - 2000; // 2 second duration
      const timeSinceBurnStart = currentTime - burnStartTime;
      const currentTick = Math.floor(timeSinceBurnStart / burnTickInterval);

      // Show damage number if we're on a new tick
      if (currentTick > 0 && timeSinceBurnStart % burnTickInterval < 50) {
        const newDamageNumber = {
          id: `${enemy.id}_burn_${currentTime}`,
          damage: enemy.burnDamage,
          x: enemy.x + 20,
          y: enemy.y - 10,
        };
        setBurnDamageNumbers((prev) => [...prev, newDamageNumber]);
      }
    }
  }, [enemy.burnDamage, enemy.burnEndTime, enemy.id, enemy.x, enemy.y]);

  const removeBurnDamageNumber = (id: string) => {
    setBurnDamageNumbers((prev) => prev.filter((num) => num.id !== id));
  };

  // Check if enemy is slowed (same pattern as burn effects)
  const isSlowed = !!(
    enemy.slowEffect &&
    enemy.slowEndTime &&
    Date.now() < enemy.slowEndTime
  );

  // Check if enemy is completely frozen (permafrost effect = 100% slow)
  const isFrozen = !!(
    enemy.slowEffect === 100 &&
    enemy.slowEndTime &&
    Date.now() < enemy.slowEndTime
  );

  const isGiant = enemy.isGiant ?? false;
  const scaleMap: Record<string, number> = { giant: 2, slime: 1.3, slime_child: 0.7 };
  const scale = scaleMap[enemy.enemyType ?? "goblin"] ?? 1;

  // Spawn animation: visual-only arc from parent center to final position
  let spawnOffsetY = 0;
  if (enemy.spawnAnimation) {
    const t = Math.min(1, (Date.now() - enemy.spawnAnimation.startTime) / enemy.spawnAnimation.duration);
    const baseOffset = enemy.spawnAnimation.originY - enemy.y; // distance from final pos to parent center
    spawnOffsetY = baseOffset * (1 - t) + Math.sin(t * Math.PI) * -10; // lerp + arc
  }

  return (
    <>
      <div
        className={`enemy ${isSlowed ? "enemy-slow" : ""} ${isGiant ? "enemy-giant" : ""}`}
        style={{
          left: `${enemy.x}px`,
          top: `${enemy.y}px`,
          transform: `translateY(${spawnOffsetY}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
        onClick={() => onClick(enemy)}
      >
        <div className="enemy-health-bar">
          <div
            className="enemy-health-fill"
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
        <div className="enemy-sprite">
          <EnemySprite colorIndex={enemy.colorIndex} enemyType={enemy.enemyType} isPaused={isPaused} />
        </div>
        <div className="enemy-health-text">
          {enemy.health}/{enemy.maxHealth}
        </div>
      </div>

      {/* Fire particles for burning enemies */}
      <FireParticles
        x={isGiant ? enemy.x - 15 : enemy.x}
        y={isGiant ? enemy.y - 18 : enemy.y}
        isBurning={
          !!(
            enemy.burnDamage &&
            enemy.burnEndTime &&
            Date.now() < enemy.burnEndTime
          )
        }
        isGiant={isGiant}
      />

      {/* Ice block effect for frozen enemies */}
      <IceBlockEffect
        x={isGiant ? enemy.x - 10 : enemy.x + 9}
        y={isGiant ? enemy.y + 19 : enemy.y + 31}
        isFrozen={isFrozen}
        isGiant={isGiant}
      />

      {/* Burn damage numbers */}
      {burnDamageNumbers.map((damageNumber) => (
        <BurnDamageNumber
          key={damageNumber.id}
          damage={damageNumber.damage}
          x={damageNumber.x}
          y={damageNumber.y}
          onComplete={() => removeBurnDamageNumber(damageNumber.id)}
        />
      ))}
    </>
  );
};

export default Enemy;
