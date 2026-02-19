import type {
  GameState,
  Enemy as EnemyType,
  LevelUpAnimation,
  FloatingText as FloatingTextType,
} from "../types/GameState";
import type { ElementType } from "../data/elements";
import { useEffect, useRef, useCallback } from "react";
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
import VortexEffect from "./VortexEffect";
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
  updateVortexEffectsInGameLoop,
} from "../utils/gameLogic";
import { generateWave } from "../utils/gameLogic/waveGenerator";
import { enemies } from "../data/enemies";
import { GAME_DIMENSIONS } from "../constants/gameDimensions";
import "./GameArea.css";

interface GameAreaProps {
  stateRef: React.MutableRefObject<GameState>;
  triggerRender: () => void;
}

const GameArea: React.FC<GameAreaProps> = ({ stateRef, triggerRender }) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const waveTimeoutsRef = useRef<number[]>([]);

  // Wave-based enemy spawning with random distribution over 3s
  useEffect(() => {
    if (stateRef.current.isPaused) return;

    const spawnWave = () => {
      if (!gameAreaRef.current) return;
      const wave = generateWave(stateRef.current.difficultyLevel, enemies);
      const enemyIds: string[] = wave.waveEnemies.flatMap((waveEnemy) =>
        Array(waveEnemy.count).fill(waveEnemy.enemyId)
      );
      const rect = gameAreaRef.current.getBoundingClientRect();

      // Clear previous timeouts
      waveTimeoutsRef.current.forEach(clearTimeout);
      waveTimeoutsRef.current = [];

      enemyIds.forEach((enemyId) => {
        const delay = Math.random() * 3000;
        const timeout = setTimeout(() => {
          const spawnX = Math.max(rect.width - 100, 700);
          const spawnY = Math.random() * (rect.height - 100) + 50;
          const newEnemy = createEnemy(spawnX, spawnY, enemyId);
          stateRef.current.enemies = [...stateRef.current.enemies, newEnemy];
          // Don't trigger render here - game loop will handle it
        }, delay);
        waveTimeoutsRef.current.push(timeout);
      });
    };

    spawnWave();
    const waveInterval = setInterval(spawnWave, 3000);

    return () => {
      clearInterval(waveInterval);
      waveTimeoutsRef.current.forEach(clearTimeout);
    };
  }, [stateRef.current.difficultyLevel, stateRef.current.isPaused, stateRef]);

  // Main game loop - now uses ref-based state for synchronous updates
  useEffect(() => {
    if (stateRef.current.isPaused) return;

    const gameLoop = setInterval(() => {
      const state = stateRef.current;
      const now = Date.now();

      // Update vortex effects first (clean up expired ones)
      const enemiesWithUpdatedVortexes = updateVortexEffectsInGameLoop(
        state.enemies,
        now
      );

      // Move enemies (including vortex pull effects)
      const movedEnemies = moveEnemies(enemiesWithUpdatedVortexes, now);

      const enemiesWithBurnDamage = processBurnDamage(movedEnemies, now);
      const aliveEnemies = removeDeadEnemies(enemiesWithBurnDamage);

      // Update defenders (attack enemies) - now reads current predicted damage synchronously
      const {
        defenders: updatedDefenders,
        enemies: enemiesAfterDefenderAttacks,
        arrows: newArrows,
        predictedArrowDamage: updatedPredictedArrowDamage,
        predictedBurnDamage: updatedPredictedBurnDamage,
        vortexes: newVortexes,
      } = updateDefenders(
        state.defenders,
        aliveEnemies,
        now,
        state.predictedArrowDamage,
        state.predictedBurnDamage,
        state.purchases,
        state.elements
      );

      // Update state synchronously - these values are immediately visible
      state.defenders = updatedDefenders;
      state.predictedArrowDamage = updatedPredictedArrowDamage;
      state.predictedBurnDamage = updatedPredictedBurnDamage;

      // Capture previous element levels before arrow processing
      const previousElementLevels = {
        fire: state.elements.fire?.level || 1,
        ice: state.elements.ice?.level || 1,
        earth: state.elements.earth?.level || 1,
        air: state.elements.air?.level || 1,
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
        [...state.arrows, ...newArrows],
        enemiesAfterDefenderAttacks,
        now,
        updatedPredictedArrowDamage,
        updatedPredictedBurnDamage,
        state.elements,
        state.purchases
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
          const defendersOfType = updatedDefenders.filter(
            (defender) => defender.type === elementType
          );

          defendersOfType.forEach((defender) => {
            const levelUpAnimation = createLevelUpAnimation(
              elementType,
              defender.x + 11,
              defender.y + 8,
              now
            );
            newLevelUpAnimations.push(levelUpAnimation);

            const floatingText = createFloatingText(
              "Level up!",
              defender.x + 20,
              defender.y - 10,
              elementType,
              now
            );
            newFloatingTexts.push(floatingText);
          });
        }
      });

      // Remove dead enemies after all processing
      const finalEnemies = removeDeadEnemies(enemiesAfterArrowImpacts);

      // Handle castle damage
      const { castleHealth, enemies: enemiesAfterCastle, castleDestroyed } = damageCastle(
        finalEnemies,
        state.castleHealth
      );

      // If castle is destroyed, handle the consequences
      if (castleDestroyed) {
        const destroyedState = handleCastleDestruction(state);
        stateRef.current = destroyedState;
        triggerRender();
        return;
      }

      // Update all state synchronously
      state.enemies = enemiesAfterCastle;
      state.arrows = activeArrows;
      state.gold = state.gold + goldGained;
      state.goldPopups = [...state.goldPopups, ...newGoldPopups];
      state.splashEffects = [...state.splashEffects, ...newSplashEffects];
      state.vortexes = [...state.vortexes, ...newVortexes];
      state.damageNumbers = [...state.damageNumbers, ...newDamageNumbers];
      state.levelUpAnimations = [...state.levelUpAnimations, ...newLevelUpAnimations];
      state.floatingTexts = [...state.floatingTexts, ...newFloatingTexts];
      state.castleHealth = castleHealth;
      state.predictedArrowDamage = finalPredictedArrowDamage;
      state.predictedBurnDamage = finalPredictedBurnDamage;
      state.elements = updatedElements;

      // Trigger single render at end of tick
      triggerRender();
    }, 50);

    return () => clearInterval(gameLoop);
  }, [stateRef.current.isPaused, stateRef, triggerRender]);

  // Clean up expired splash effects and floating texts
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const state = stateRef.current;
      const currentTime = Date.now();

      state.splashEffects = state.splashEffects.filter(
        (effect) => currentTime - effect.startTime < effect.duration
      );
      state.floatingTexts = state.floatingTexts.filter(
        (text) => currentTime - text.startTime < text.duration
      );
      state.damageNumbers = (state.damageNumbers || []).filter(
        (damageNumber) => currentTime - damageNumber.startTime < 1500
      );
      state.upgradeAnimations = (state.upgradeAnimations || []).filter(
        (animation) => currentTime - animation.startTime < animation.duration
      );
      // Don't trigger render - let game loop handle it
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, [stateRef]);

  const handleEnemyClick = useCallback(
    (enemy: EnemyType) => {
      const state = stateRef.current;
      if (state.isPaused) return;

      const { enemy: damagedEnemy, isDead } = damageEnemy(
        enemy,
        state.clickDamage
      );

      state.enemies = state.enemies.map((e) =>
        e.id === enemy.id ? damagedEnemy : e
      );

      if (isDead) {
        const { goldGained, goldPopups: deathPopups } = handleEnemyDeath(
          enemy,
          Date.now()
        );
        state.enemies = state.enemies.filter((e) => e.id !== enemy.id);
        state.gold = state.gold + goldGained;
        state.goldPopups = [...state.goldPopups, ...deathPopups];
      }

      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleGoldPopupComplete = useCallback(
    (id: string) => {
      stateRef.current.goldPopups = stateRef.current.goldPopups.filter(
        (p) => p.id !== id
      );
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleLevelUpComplete = useCallback(
    (id: string) => {
      stateRef.current.levelUpAnimations = stateRef.current.levelUpAnimations.filter(
        (a) => a.id !== id
      );
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleFloatingTextComplete = useCallback(
    (id: string) => {
      stateRef.current.floatingTexts = stateRef.current.floatingTexts.filter(
        (t) => t.id !== id
      );
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleUpgradeComplete = useCallback(
    (id: string) => {
      stateRef.current.upgradeAnimations = (
        stateRef.current.upgradeAnimations || []
      ).filter((a) => a.id !== id);
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleDamageNumberComplete = useCallback(
    (id: string) => {
      stateRef.current.damageNumbers = (
        stateRef.current.damageNumbers || []
      ).filter((dn) => dn.id !== id);
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  // Read current state for rendering
  const gameState = stateRef.current;

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
            onComplete={() => handleGoldPopupComplete(popup.id)}
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
            onComplete={handleLevelUpComplete}
          />
        ))}

        {gameState.floatingTexts.map((text) => (
          <FloatingText
            key={text.id}
            text={text}
            onComplete={handleFloatingTextComplete}
          />
        ))}

        {gameState.vortexes?.map((vortex) => (
          <VortexEffect
            key={vortex.id}
            vortex={vortex}
            currentTime={Date.now()}
          />
        ))}

        {gameState.upgradeAnimations?.map((animation) => (
          <UpgradeFireworks
            key={animation.id}
            animation={animation}
            x={animation.mageX}
            y={animation.mageY}
            onComplete={handleUpgradeComplete}
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
            onComplete={() => handleDamageNumberComplete(damageNumber.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameArea;
