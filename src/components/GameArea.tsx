import type {
  Enemy as EnemyType,
  LevelUpAnimation,
  FloatingText as FloatingTextType,
} from "../types/GameState";
import type { GameState } from "../types/GameStateSlices";
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
    if (stateRef.current.core.isPaused) return;

    const spawnWave = () => {
      if (!gameAreaRef.current) return;
      const wave = generateWave(stateRef.current.core.difficultyLevel, enemies);
      const enemyIds: string[] = wave.waveEnemies.flatMap((waveEnemy) =>
        Array(waveEnemy.count).fill(waveEnemy.enemyId)
      );
      const rect = gameAreaRef.current.getBoundingClientRect();

      waveTimeoutsRef.current.forEach(clearTimeout);
      waveTimeoutsRef.current = [];

      enemyIds.forEach((enemyId) => {
        const delay = Math.random() * 3000;
        const timeout = setTimeout(() => {
          const spawnX = Math.max(rect.width - 100, 700);
          const spawnY = Math.random() * (rect.height - 100) + 50;
          const newEnemy = createEnemy(spawnX, spawnY, enemyId);
          stateRef.current.entities.enemies = [
            ...stateRef.current.entities.enemies,
            newEnemy,
          ];
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
  }, [
    stateRef.current.core.difficultyLevel,
    stateRef.current.core.isPaused,
    stateRef,
  ]);

  // Main game loop
  useEffect(() => {
    if (stateRef.current.core.isPaused) return;

    const gameLoop = setInterval(() => {
      const state = stateRef.current;
      const now = Date.now();

      // Update vortex effects first (clean up expired ones)
      const enemiesWithUpdatedVortexes = updateVortexEffectsInGameLoop(
        state.entities.enemies,
        now
      );

      // Move enemies (including vortex pull effects)
      const movedEnemies = moveEnemies(enemiesWithUpdatedVortexes, now);

      const enemiesWithBurnDamage = processBurnDamage(movedEnemies, now);
      const aliveEnemies = removeDeadEnemies(enemiesWithBurnDamage);

      // Update defenders (attack enemies)
      const {
        defenders: updatedDefenders,
        enemies: enemiesAfterDefenderAttacks,
        arrows: newArrows,
        predictedArrowDamage: updatedPredictedArrowDamage,
        predictedBurnDamage: updatedPredictedBurnDamage,
        vortexes: newVortexes,
      } = updateDefenders(
        state.entities.defenders,
        aliveEnemies,
        now,
        state.tracking.predictedArrowDamage,
        state.tracking.predictedBurnDamage,
        state.core.purchases,
        state.core.elements
      );

      // Update state synchronously
      state.entities.defenders = updatedDefenders;
      state.tracking.predictedArrowDamage = updatedPredictedArrowDamage;
      state.tracking.predictedBurnDamage = updatedPredictedBurnDamage;

      // Capture previous element levels before arrow processing
      const previousElementLevels = {
        fire: state.core.elements.fire?.level || 1,
        ice: state.core.elements.ice?.level || 1,
        earth: state.core.elements.earth?.level || 1,
        air: state.core.elements.air?.level || 1,
      };

      // Process arrow impacts
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
        [...state.entities.arrows, ...newArrows],
        enemiesAfterDefenderAttacks,
        now,
        updatedPredictedArrowDamage,
        updatedPredictedBurnDamage,
        state.core.elements,
        state.core.purchases
      );

      // Check for level-ups and create animations
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
      const {
        castleHealth,
        enemies: enemiesAfterCastle,
        castleDestroyed,
      } = damageCastle(finalEnemies, state.core.castleHealth);

      // If castle is destroyed, apply death penalty
      if (castleDestroyed) {
        state.core.castleHealth = 100;
        state.core.gold = Math.floor(state.core.gold / 2); // Death penalty: lose half gold
        state.entities.enemies = [];
        state.entities.arrows = [];
        state.entities.vortexes = [];
        state.tracking.predictedArrowDamage = new Map(); // Clear stale tracking
        state.tracking.predictedBurnDamage = new Map();
        state.visuals.goldPopups = [];
        state.visuals.damageNumbers = [];
        triggerRender();
        return;
      }

      // Update all state synchronously
      state.entities.enemies = enemiesAfterCastle;
      state.entities.arrows = activeArrows;
      state.entities.vortexes = [...state.entities.vortexes, ...newVortexes];
      state.core.gold += goldGained;
      state.core.castleHealth = castleHealth;
      state.core.elements = updatedElements;
      state.tracking.predictedArrowDamage = finalPredictedArrowDamage;
      state.tracking.predictedBurnDamage = finalPredictedBurnDamage;

      // Update visuals
      state.visuals.goldPopups = [...state.visuals.goldPopups, ...newGoldPopups];
      state.visuals.splashEffects = [
        ...state.visuals.splashEffects,
        ...newSplashEffects,
      ];
      state.visuals.damageNumbers = [
        ...state.visuals.damageNumbers,
        ...newDamageNumbers,
      ];
      state.visuals.levelUpAnimations = [
        ...state.visuals.levelUpAnimations,
        ...newLevelUpAnimations,
      ];
      state.visuals.floatingTexts = [
        ...state.visuals.floatingTexts,
        ...newFloatingTexts,
      ];

      triggerRender();
    }, 50);

    return () => clearInterval(gameLoop);
  }, [stateRef.current.core.isPaused, stateRef, triggerRender]);

  // Clean up expired visual effects
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const visuals = stateRef.current.visuals;
      const currentTime = Date.now();

      visuals.splashEffects = visuals.splashEffects.filter(
        (effect) => currentTime - effect.startTime < effect.duration
      );
      visuals.floatingTexts = visuals.floatingTexts.filter(
        (text) => currentTime - text.startTime < text.duration
      );
      visuals.damageNumbers = visuals.damageNumbers.filter(
        (dn) => currentTime - dn.startTime < 1500
      );
      visuals.upgradeAnimations = visuals.upgradeAnimations.filter(
        (animation) => currentTime - animation.startTime < animation.duration
      );
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, [stateRef]);

  const handleEnemyClick = useCallback(
    (enemy: EnemyType) => {
      const state = stateRef.current;
      if (state.core.isPaused) return;

      const { enemy: damagedEnemy, isDead } = damageEnemy(
        enemy,
        state.core.clickDamage
      );

      state.entities.enemies = state.entities.enemies.map((e) =>
        e.id === enemy.id ? damagedEnemy : e
      );

      if (isDead) {
        const { goldGained, goldPopups: deathPopups } = handleEnemyDeath(
          enemy,
          Date.now()
        );
        state.entities.enemies = state.entities.enemies.filter(
          (e) => e.id !== enemy.id
        );
        state.core.gold += goldGained;
        state.visuals.goldPopups = [
          ...state.visuals.goldPopups,
          ...deathPopups,
        ];
      }

      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleGoldPopupComplete = useCallback(
    (id: string) => {
      stateRef.current.visuals.goldPopups =
        stateRef.current.visuals.goldPopups.filter((p) => p.id !== id);
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleLevelUpComplete = useCallback(
    (id: string) => {
      stateRef.current.visuals.levelUpAnimations =
        stateRef.current.visuals.levelUpAnimations.filter((a) => a.id !== id);
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleFloatingTextComplete = useCallback(
    (id: string) => {
      stateRef.current.visuals.floatingTexts =
        stateRef.current.visuals.floatingTexts.filter((t) => t.id !== id);
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleUpgradeComplete = useCallback(
    (id: string) => {
      stateRef.current.visuals.upgradeAnimations =
        stateRef.current.visuals.upgradeAnimations.filter((a) => a.id !== id);
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleDamageNumberComplete = useCallback(
    (id: string) => {
      stateRef.current.visuals.damageNumbers =
        stateRef.current.visuals.damageNumbers.filter((dn) => dn.id !== id);
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  // Read current state for rendering
  const { core, entities, visuals } = stateRef.current;

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

        {entities.defenders.map((defender) => (
          <Defender key={defender.id} {...defender} />
        ))}

        {entities.arrows.map((arrow) => {
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

        {entities.enemies.map((enemy) => (
          <Enemy
            key={enemy.id}
            enemy={enemy}
            onClick={handleEnemyClick}
            isPaused={core.isPaused}
          />
        ))}

        {visuals.goldPopups.map((popup) => (
          <GoldPopup
            key={popup.id}
            id={popup.id}
            x={popup.x}
            y={popup.y}
            amount={popup.amount}
            onComplete={() => handleGoldPopupComplete(popup.id)}
          />
        ))}

        {visuals.splashEffects.map((effect) => (
          <SplashEffectComponent
            key={effect.id}
            effect={effect}
            currentTime={Date.now()}
          />
        ))}

        {visuals.levelUpAnimations.map((animation) => (
          <LevelUpAnimationComponent
            key={animation.id}
            animation={animation}
            onComplete={handleLevelUpComplete}
          />
        ))}

        {visuals.floatingTexts.map((text) => (
          <FloatingText
            key={text.id}
            text={text}
            onComplete={handleFloatingTextComplete}
          />
        ))}

        {entities.vortexes?.map((vortex) => (
          <VortexEffect
            key={vortex.id}
            vortex={vortex}
            currentTime={Date.now()}
          />
        ))}

        {visuals.upgradeAnimations?.map((animation) => (
          <UpgradeFireworks
            key={animation.id}
            animation={animation}
            x={animation.mageX}
            y={animation.mageY}
            onComplete={handleUpgradeComplete}
          />
        ))}

        {visuals.damageNumbers?.map((damageNumber) => (
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
