import type {
  GameState,
  Enemy as EnemyType,
  LevelUpAnimation,
  FloatingText as FloatingTextType,
} from "../types/GameState";
import type { ElementType } from "../data/elements";
import { useEffect, useRef } from "react";
import Enemy from "./Enemy";
import Castle from "./Castle";
import Defender from "./Defender";
import Arrow from "./Arrow";
import GoldPopup from "./GoldPopup";
import SplashEffectComponent from "./SplashEffect";
import LevelUpAnimationComponent from "./LevelUpAnimation";
import FloatingText from "./FloatingText";
import UpgradeFireworks from "./UpgradeFireworks";
import DamageNumber from "./DamageNumber";
import { createLevelUpAnimation, createFloatingText } from "../utils/gameLogic";
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
import { GAME_DIMENSIONS } from "../constants/gameDimensions";
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

        // Capture previous element levels before arrow processing
        const previousElementLevels = {
          fire: prev.elements.fire?.level || 1,
          ice: prev.elements.ice?.level || 1,
          earth: prev.elements.earth?.level || 1,
          air: prev.elements.air?.level || 1,
        };

        // Process arrow impacts and update arrows
        const {
          arrows: activeArrows,
          enemies: enemiesAfterArrowImpacts,
          goldGained,
          goldPopups: newGoldPopups,
          splashEffects: newSplashEffects,
          damageNumbers: newDamageNumbers,
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

        // Check for level-ups and create animations for all defenders of that element type
        const newLevelUpAnimations: LevelUpAnimation[] = [];
        const newFloatingTexts: FloatingTextType[] = [];
        const elementTypes: ElementType[] = ["fire", "ice", "earth", "air"];

        elementTypes.forEach((elementType) => {
          const prevLevel = previousElementLevels[elementType];
          const updatedElement = updatedElements[elementType];
          const newLevel = updatedElement?.level || 1;

          if (newLevel > prevLevel) {
            // Find all defenders of this element type
            const defendersOfType = updatedDefenders.filter(
              (defender) => defender.type === elementType
            );

            // Create level-up animation and floating text for each defender of this element type
            defendersOfType.forEach((defender) => {
              const levelUpAnimation = createLevelUpAnimation(
                elementType,
                defender.x + 11,
                defender.y + 8,
                Date.now()
              );
              newLevelUpAnimations.push(levelUpAnimation);

              // Create floating text showing the stat increase
              const floatingText = createFloatingText(
                "Level up!",
                defender.x + 20, // Center of the defender
                defender.y - 10, // Position above the defender
                elementType,
                Date.now()
              );
              newFloatingTexts.push(floatingText);
            });
          }
        });

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
          damageNumbers: [...prev.damageNumbers, ...newDamageNumbers],
          levelUpAnimations: [
            ...prev.levelUpAnimations,
            ...newLevelUpAnimations,
          ],
          floatingTexts: [...prev.floatingTexts, ...newFloatingTexts],
          castleHealth,
          predictedArrowDamage: finalPredictedArrowDamage,
          predictedBurnDamage: finalPredictedBurnDamage,
          elements: updatedElements,
        };
      });
    }, 50); // Update every 50ms for smooth movement

    return () => clearInterval(gameLoop);
  }, [gameState.isPaused, setGameState]);

  // Clean up expired splash effects and floating texts
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const currentTime = Date.now();
      setGameState((prev) => ({
        ...prev,
        splashEffects: prev.splashEffects.filter(
          (effect) => currentTime - effect.startTime < effect.duration
        ),
        floatingTexts: prev.floatingTexts.filter(
          (text) => currentTime - text.startTime < text.duration
        ),
        damageNumbers:
          prev.damageNumbers?.filter(
            (damageNumber) => currentTime - damageNumber.startTime < 1500
          ) || [],
        upgradeAnimations:
          prev.upgradeAnimations?.filter(
            (animation) =>
              currentTime - animation.startTime < animation.duration
          ) || [],
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
        <div
          className="castle-area"
          style={
            {
              "--castle-width": `${GAME_DIMENSIONS.CASTLE_WIDTH}px`,
            } as React.CSSProperties
          }
        >
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

        {gameState.levelUpAnimations.map((animation) => (
          <LevelUpAnimationComponent
            key={animation.id}
            animation={animation}
            onComplete={(id: string) => {
              setGameState((prev) => ({
                ...prev,
                levelUpAnimations: prev.levelUpAnimations.filter(
                  (a) => a.id !== id
                ),
              }));
            }}
          />
        ))}

        {gameState.floatingTexts.map((text) => (
          <FloatingText
            key={text.id}
            text={text}
            onComplete={(id: string) => {
              setGameState((prev) => ({
                ...prev,
                floatingTexts: prev.floatingTexts.filter((t) => t.id !== id),
              }));
            }}
          />
        ))}

        {gameState.upgradeAnimations?.map((animation) => (
          <UpgradeFireworks
            key={animation.id}
            animation={animation}
            x={animation.mageX}
            y={animation.mageY}
            onComplete={(id: string) => {
              setGameState((prev) => ({
                ...prev,
                upgradeAnimations:
                  prev.upgradeAnimations?.filter((a) => a.id !== id) || [],
              }));
            }}
          />
        ))}

        {gameState.damageNumbers?.map((damageNumber) => (
          <DamageNumber
            key={damageNumber.id}
            damage={damageNumber.damage}
            x={damageNumber.x}
            y={damageNumber.y}
            elementType={damageNumber.elementType}
            isCritical={damageNumber.isCritical}
            onComplete={() => {
              setGameState((prev) => ({
                ...prev,
                damageNumbers:
                  prev.damageNumbers?.filter(
                    (dn) => dn.id !== damageNumber.id
                  ) || [],
              }));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GameArea;
