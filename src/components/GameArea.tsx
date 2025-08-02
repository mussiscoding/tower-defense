import type { GameState, Enemy as EnemyType } from "../types/GameState";
import { useEffect, useRef } from "react";
import Enemy from "./Enemy";
import Castle from "./Castle";
import Defender from "./Defender";
import Arrow from "./Arrow";
import GoldPopup from "./GoldPopup";
import {
  createEnemy,
  moveEnemies,
  removeDeadEnemies,
  damageEnemy,
  damageCastle,
  handleCastleDestruction,
  updateDefenders,
  getArrowProgress,
  processArrowImpacts,
  processBurnDamage,
  handleEnemyDeath,
} from "../utils/gameLogic";
import "./GameArea.css";

interface GameAreaProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameArea: React.FC<GameAreaProps> = ({ gameState, setGameState }) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Enemy spawning
  useEffect(() => {
    if (gameState.isPaused) return;

    const spawnInterval = setInterval(() => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const spawnX = Math.max(rect.width - 100, 700); // Spawn from right edge, minimum 700px from left
        const spawnY = Math.random() * (rect.height - 100) + 50; // Random Y position

        const newEnemy = createEnemy(spawnX, spawnY, gameState.difficultyLevel);

        setGameState((prev) => ({
          ...prev,
          enemies: [...prev.enemies, newEnemy],
        }));
      }
    }, 2000 / gameState.spawnRateLevel); // Spawn rate level affects interval

    return () => clearInterval(spawnInterval);
  }, [
    gameState.spawnRate,
    gameState.difficultyLevel,
    gameState.isPaused,
    setGameState,
  ]);

  // Enemy movement and defender attacks
  // Game loop
  useEffect(() => {
    if (gameState.isPaused) return;

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        const movedEnemies = moveEnemies(prev.enemies, Date.now());
        const enemiesWithBurnDamage = processBurnDamage(
          movedEnemies,
          Date.now()
        );
        const aliveEnemies = removeDeadEnemies(enemiesWithBurnDamage);

        // Update defenders (attack enemies)
        const {
          defenders: updatedDefenders,
          enemies: enemiesAfterDefenderAttacks,
          arrows: newArrows,
          predictedDamage: updatedPredictedDamage,
        } = updateDefenders(
          prev.defenders,
          aliveEnemies,
          Date.now(),
          prev.predictedDamage
        );

        // Process arrow impacts and update arrows
        const {
          arrows: activeArrows,
          enemies: enemiesAfterArrowImpacts,
          goldGained,
          goldPopups: newGoldPopups,
          predictedDamage: finalPredictedDamage,
          elements: updatedElements,
        } = processArrowImpacts(
          [...prev.arrows, ...newArrows],
          enemiesAfterDefenderAttacks,
          Date.now(),
          updatedPredictedDamage,
          prev.elements,
          prev.purchases
        );

        // Handle castle damage
        const { castleHealth, enemies, castleDestroyed } = damageCastle(
          enemiesAfterArrowImpacts,
          prev.castleHealth
        );

        // If castle is destroyed, handle the consequences
        if (castleDestroyed) {
          return handleCastleDestruction(prev);
        }

        return {
          ...prev,
          defenders: updatedDefenders,
          enemies,
          arrows: activeArrows,
          gold: prev.gold + goldGained,
          goldPopups: [...prev.goldPopups, ...newGoldPopups],
          castleHealth,
          predictedDamage: finalPredictedDamage,
          elements: updatedElements,
        };
      });
    }, 50); // Update every 50ms for smooth movement

    return () => clearInterval(gameLoop);
  }, [gameState.isPaused, setGameState]);

  const handleEnemyClick = (enemy: EnemyType) => {
    if (gameState.isPaused) return; // Prevent clicking when paused

    const { enemy: damagedEnemy, isDead } = damageEnemy(
      enemy,
      gameState.clickDamage
    );

    setGameState((prev) => {
      const updatedEnemies = prev.enemies.map((e) =>
        e.id === enemy.id ? damagedEnemy : e
      );

      if (isDead) {
        const { goldGained, goldPopups: deathPopups } = handleEnemyDeath(
          enemy,
          Date.now()
        );
        return {
          ...prev,
          enemies: updatedEnemies.filter((e) => e.id !== enemy.id),
          gold: prev.gold + goldGained,
          goldPopups: [...prev.goldPopups, ...deathPopups],
        };
      }

      return {
        ...prev,
        enemies: updatedEnemies,
      };
    });
  };

  return (
    <div className="game-area" ref={gameAreaRef}>
      <div className="battlefield">
        <div className="castle-area">
          <Castle />
        </div>

        {gameState.defenders.map((defender) => (
          <Defender key={defender.id} {...defender} />
        ))}

        {gameState.arrows.map((arrow) => {
          const progress = getArrowProgress(arrow, Date.now());
          return (
            <Arrow
              key={arrow.id}
              id={arrow.id}
              startX={arrow.startX}
              startY={arrow.startY}
              endX={arrow.endX}
              endY={arrow.endY}
              progress={progress}
              elementType={arrow.elementType}
            />
          );
        })}

        {gameState.enemies.map((enemy) => (
          <Enemy key={enemy.id} enemy={enemy} onClick={handleEnemyClick} />
        ))}

        {gameState.goldPopups.map((popup) => (
          <GoldPopup
            key={popup.id}
            id={popup.id}
            x={popup.x}
            y={popup.y}
            amount={popup.amount}
            onComplete={() => {
              setGameState((prev) => ({
                ...prev,
                goldPopups: prev.goldPopups.filter((p) => p.id !== popup.id),
              }));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GameArea;
