import type { GameState, Enemy as EnemyType } from "../types/GameState";
import { useEffect, useRef } from "react";
import Enemy from "./Enemy";
import Castle from "./Castle";
import Defender from "./Defender";
import Arrow from "./Arrow";
import GoldPopup from "./GoldPopup";
import SplashEffectComponent from "./SplashEffect";
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
import { generateWave } from "../utils/gameLogic/waveGenerator";
import { enemies } from "../data/enemies";
import "./GameArea.css";

interface GameAreaProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameArea: React.FC<GameAreaProps> = ({ gameState, setGameState }) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Wave-based enemy spawning with random distribution over 3s
  useEffect(() => {
    if (gameState.isPaused) return;

    const timeouts: number[] = [];

    const spawnWave = () => {
      if (!gameAreaRef.current) return;
      const wave = generateWave(gameState.difficultyLevel, enemies);
      // Flatten the wave into a list of enemyIds
      const enemyIds: string[] = wave.waveEnemies.flatMap((waveEnemy) =>
        Array(waveEnemy.count).fill(waveEnemy.enemyId)
      );
      const rect = gameAreaRef.current.getBoundingClientRect();
      // For each enemy, schedule a spawn at a random time in [0, 3000) ms
      enemyIds.forEach((enemyId) => {
        const delay = Math.random() * 3000;
        const timeout = setTimeout(() => {
          const spawnX = Math.max(rect.width - 100, 700);
          const spawnY = Math.random() * (rect.height - 100) + 50;
          const newEnemy = createEnemy(spawnX, spawnY, enemyId);
          setGameState((prev) => ({
            ...prev,
            enemies: [...prev.enemies, newEnemy],
          }));
        }, delay);
        timeouts.push(timeout);
      });
    };

    // Spawn a wave every 3 seconds
    spawnWave();
    const waveInterval = setInterval(spawnWave, 3000);

    return () => {
      clearInterval(waveInterval);
      timeouts.forEach(clearTimeout);
    };
  }, [gameState.difficultyLevel, gameState.isPaused, setGameState]);

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
          predictedArrowDamage: updatedPredictedArrowDamage,
          predictedBurnDamage: updatedPredictedBurnDamage,
        } = updateDefenders(
          prev.defenders,
          aliveEnemies,
          Date.now(),
          prev.predictedArrowDamage,
          prev.predictedBurnDamage,
          prev.purchases,
          prev.elements
        );

        // Process arrow impacts and update arrows
        const {
          arrows: activeArrows,
          enemies: enemiesAfterArrowImpacts,
          goldGained,
          goldPopups: newGoldPopups,
          splashEffects: newSplashEffects,
          predictedArrowDamage: finalPredictedArrowDamage,
          predictedBurnDamage: finalPredictedBurnDamage,
          elements: updatedElements,
        } = processArrowImpacts(
          [...prev.arrows, ...newArrows],
          enemiesAfterDefenderAttacks,
          Date.now(),
          updatedPredictedArrowDamage,
          updatedPredictedBurnDamage,
          prev.elements,
          prev.purchases
        );

        // Remove dead enemies after all processing
        const finalEnemies = removeDeadEnemies(enemiesAfterArrowImpacts);

        // Handle castle damage
        const { castleHealth, enemies, castleDestroyed } = damageCastle(
          finalEnemies,
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
          splashEffects: [...prev.splashEffects, ...newSplashEffects],
          castleHealth,
          predictedArrowDamage: finalPredictedArrowDamage,
          predictedBurnDamage: finalPredictedBurnDamage,
          elements: updatedElements,
        };
      });
    }, 50); // Update every 50ms for smooth movement

    return () => clearInterval(gameLoop);
  }, [gameState.isPaused, setGameState]);

  // Clean up expired splash effects
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const currentTime = Date.now();
      setGameState((prev) => ({
        ...prev,
        splashEffects: prev.splashEffects.filter(
          (effect) => currentTime - effect.startTime < effect.duration
        ),
      }));
    }, 100); // Check every 100ms

    return () => clearInterval(cleanupInterval);
  }, [setGameState]);

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
          <Enemy
            key={enemy.id}
            enemy={enemy}
            onClick={handleEnemyClick}
            isPaused={gameState.isPaused}
          />
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

        {gameState.splashEffects.map((effect) => (
          <SplashEffectComponent
            key={effect.id}
            effect={effect}
            currentTime={Date.now()}
          />
        ))}
      </div>
    </div>
  );
};

export default GameArea;
