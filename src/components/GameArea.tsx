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
import XpPopup from "./XpPopup";
import SplashEffectComponent from "./SplashEffect";
import LevelUpAnimationComponent from "./LevelUpAnimation";
import FloatingText from "./FloatingText";
import UpgradeFireworks from "./UpgradeFireworks";
import DamageNumber from "./DamageNumber";
import VortexEffect from "./VortexEffect";
import MergeAnimationComponent from "./MergeAnimation";
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
  getDamageMultiplier,
  getGoldMultiplier,
  getAttackSpeedMultiplier,
  filterExpiredPowerUps,
  trySpawnPowerUp,
} from "../utils/gameLogic";
import { getPowerUpDef, getGoldDropAmount, getXpDropAmount } from "../data/powerups";
import SpawnedPowerUpComponent from "./SpawnedPowerUp";
import ActiveBuffsHUD from "./ActiveBuffsHUD";
import { generateWave } from "../utils/gameLogic/waveGenerator";
import { GAME_DIMENSIONS } from "../constants/gameDimensions";
import {
  GAME_TIMING,
  createInitialGameLoopMeta,
  type GameLoopMeta,
} from "../constants/gameTiming";
import { saveGame } from "../utils/saveSystem";
import { tryUnlockAchievement, checkStateAchievements } from "../utils/achievementUtils";
import AchievementPopup from "./AchievementPopup";
import "./GameArea.css";

interface GameAreaProps {
  stateRef: React.MutableRefObject<GameState>;
  triggerRender: () => void;
}

const GameArea: React.FC<GameAreaProps> = ({ stateRef, triggerRender }) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<GameLoopMeta>(createInitialGameLoopMeta());

  // Single unified game loop
  useEffect(() => {
    if (stateRef.current.core.isPaused) return;

    const gameLoop = setInterval(() => {
      const state = stateRef.current;
      const meta = metaRef.current;
      const now = Date.now();

      meta.tickCount++;

      // POWER-UP MULTIPLIERS (compute once per tick; element-specific ones computed inside arrow/burn processing)
      const goldMultiplier = getGoldMultiplier(state.core.activePowerUps, now);
      const attackSpeedMultiplier = getAttackSpeedMultiplier(state.core.activePowerUps, now);

      // POWER-UP EXPIRY
      state.core.activePowerUps = filterExpiredPowerUps(state.core.activePowerUps, now);
      if (state.entities.spawnedPowerUp && now > state.entities.spawnedPowerUp.despawnTime) {
        state.entities.spawnedPowerUp = null;
      }

      // POWER-UP SPAWN
      if (!state.entities.spawnedPowerUp) {
        const spawned = trySpawnPowerUp(meta, now);
        if (spawned) state.entities.spawnedPowerUp = spawned;
      }

      // 1. TIME UPDATE (every second)
      if (
        meta.tickCount - meta.lastTimeUpdateTick >=
        GAME_TIMING.TIME_SURVIVED_TICKS
      ) {
        state.core.timeSurvived++;
        meta.lastTimeUpdateTick = meta.tickCount;
      }

      // 2. WAVE SPAWNING (every 3 seconds)
      if (
        meta.tickCount - meta.lastWaveSpawnTick >=
        GAME_TIMING.WAVE_SPAWN_TICKS
      ) {
        if (gameAreaRef.current) {
          const rect = gameAreaRef.current.getBoundingClientRect();
          const wave = generateWave(state.core.difficultyLevel);

          // Add enemies with staggered spawn times
          wave.waveEnemies.forEach((waveEnemy) => {
            const spawnDelay = Math.random() * 3000;
            const spawnX = rect.width;
            const spawnY = Math.random() * (rect.height - 100) + 50;
            const newEnemy = createEnemy(spawnX, spawnY, waveEnemy.health, waveEnemy.colorIndex, {
              isGiant: waveEnemy.isGiant,
            });
            newEnemy.spawnTime = now + spawnDelay;
            state.entities.pendingEnemies.push(newEnemy);
          });
        }
        meta.lastWaveSpawnTick = meta.tickCount;
      }

      // 3. PROCESS PENDING ENEMY SPAWNS
      const readyToSpawn = state.entities.pendingEnemies.filter(
        (e) => e.spawnTime && now >= e.spawnTime
      );
      if (readyToSpawn.length > 0) {
        state.entities.enemies.push(...readyToSpawn);
        state.entities.pendingEnemies = state.entities.pendingEnemies.filter(
          (e) => !e.spawnTime || now < e.spawnTime
        );
      }

      // 4. UPDATE VORTEX EFFECTS (clean up expired ones)
      const enemiesWithUpdatedVortexes = updateVortexEffectsInGameLoop(
        state.entities.enemies,
        now
      );

      // 5. MOVE ENEMIES (including vortex pull effects)
      const movedEnemies = moveEnemies(enemiesWithUpdatedVortexes, now);

      // 6. PROCESS BURN DAMAGE
      const enemiesWithBurnDamage = processBurnDamage(movedEnemies, now, state.core.activePowerUps);

      // 7. HANDLE BURN KILLS + REMOVE DEAD ENEMIES
      const burnKilled = enemiesWithBurnDamage.filter((e) => e.health <= 0);
      burnKilled.forEach((enemy) => {
        state.core.totalEnemiesKilled++;
        const { goldGained: burnGold, goldPopups: burnPopups } = handleEnemyDeath(enemy, now, goldMultiplier);
        state.core.gold += burnGold;
        state.core.totalGoldEarned += burnGold;
        state.visuals.goldPopups.push(...burnPopups);
        tryUnlockAchievement("burn_kill", state);
        if (enemy.isGiant) tryUnlockAchievement("giant_killer", state);
      });
      const aliveEnemies = removeDeadEnemies(enemiesWithBurnDamage);

      // 8. DEFENDER ATTACKS
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
        state.core.elements,
        attackSpeedMultiplier
      );

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

      // 9. PROCESS ARROW IMPACTS
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
        killedEnemies,
        achievementEvents,
      } = processArrowImpacts(
        [...state.entities.arrows, ...newArrows],
        enemiesAfterDefenderAttacks,
        now,
        updatedPredictedArrowDamage,
        updatedPredictedBurnDamage,
        state.core.elements,
        state.core.purchases,
        state.core.activePowerUps,
        goldMultiplier,
        state.core.mageProgress
      );

      // 10. CHECK FOR LEVEL-UPS
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
            newLevelUpAnimations.push(
              createLevelUpAnimation(
                elementType,
                defender.x + 11,
                defender.y + 8,
                now
              )
            );
            newFloatingTexts.push(
              createFloatingText(
                "Level up!",
                defender.x + 20,
                defender.y - 10,
                elementType,
                now
              )
            );
          });
        }
      });

      // 10b. TRACK ARROW KILLS + ACHIEVEMENTS
      state.core.totalEnemiesKilled += killedEnemies.length;
      state.core.totalGoldEarned += goldGained;
      killedEnemies.forEach(({ enemy, damage }) => {
        if (enemy.isGiant) tryUnlockAchievement("giant_killer", state);
        if (damage >= enemy.maxHealth * 100) tryUnlockAchievement("overkill", state);
        if (enemy.slowEffect && enemy.slowEndTime && now < enemy.slowEndTime) {
          tryUnlockAchievement("slow_kill", state);
        }
      });

      // Check achievement events from skills
      if (achievementEvents.criticalHitCount > 0) {
        state.core.totalCriticalHits += achievementEvents.criticalHitCount;
      }
      if (achievementEvents.splashHitCounts) {
        if (achievementEvents.splashHitCounts.some((count) => count >= 3)) {
          tryUnlockAchievement("splash_multi", state);
        }
      }

      // 10c. HANDLE SPLASH KILLS (enemies killed by splash damage mutation)
      const splashKilled = enemiesAfterArrowImpacts.filter((e) => e.health <= 0);
      splashKilled.forEach((enemy) => {
        state.core.totalEnemiesKilled++;
        const { goldGained: splashGold, goldPopups: splashPopups } = handleEnemyDeath(enemy, now, goldMultiplier);
        state.core.gold += splashGold;
        state.core.totalGoldEarned += splashGold;
        state.visuals.goldPopups.push(...splashPopups);
        if (enemy.isGiant) tryUnlockAchievement("giant_killer", state);
      });

      // 11. REMOVE DEAD ENEMIES (after arrow impacts)
      const finalEnemies = removeDeadEnemies(enemiesAfterArrowImpacts);

      // 12. CASTLE DAMAGE CHECK
      const {
        castleHealth,
        enemies: enemiesAfterCastle,
        castleDestroyed,
      } = damageCastle(finalEnemies, state.core.castleHealth);

      if (castleDestroyed) {
        state.core.castleHealth = 100;
        state.core.gold = Math.floor(state.core.gold / 2);
        state.entities.enemies = [];
        state.entities.pendingEnemies = [];
        state.entities.arrows = [];
        state.entities.vortexes = [];
        state.entities.spawnedPowerUp = null;
        state.core.activePowerUps = [];
        state.tracking.predictedArrowDamage = new Map();
        state.tracking.predictedBurnDamage = new Map();
        state.visuals.goldPopups = [];
        state.visuals.xpPopups = [];
        state.visuals.damageNumbers = [];
        triggerRender();
        return;
      }

      // Update game state
      state.entities.enemies = enemiesAfterCastle;
      state.entities.arrows = activeArrows;
      state.entities.vortexes = [...state.entities.vortexes, ...newVortexes];
      state.core.gold += goldGained;
      state.core.castleHealth = castleHealth;
      state.core.elements = updatedElements;
      state.tracking.predictedArrowDamage = finalPredictedArrowDamage;
      state.tracking.predictedBurnDamage = finalPredictedBurnDamage;

      // Update visuals
      state.visuals.goldPopups.push(...newGoldPopups);
      state.visuals.splashEffects.push(...newSplashEffects);
      state.visuals.damageNumbers.push(...newDamageNumbers);
      state.visuals.levelUpAnimations.push(...newLevelUpAnimations);
      state.visuals.floatingTexts.push(...newFloatingTexts);

      // 13. CLEANUP VISUALS (every 200ms)
      if (meta.tickCount - meta.lastCleanupTick >= GAME_TIMING.CLEANUP_TICKS) {
        const visuals = state.visuals;
        visuals.splashEffects = visuals.splashEffects.filter(
          (effect) => now - effect.startTime < effect.duration
        );
        visuals.floatingTexts = visuals.floatingTexts.filter(
          (text) => now - text.startTime < text.duration
        );
        visuals.damageNumbers = visuals.damageNumbers.filter(
          (dn) => now - dn.startTime < 1500
        );
        visuals.upgradeAnimations = visuals.upgradeAnimations.filter(
          (animation) => now - animation.startTime < animation.duration
        );
        visuals.mergeAnimations = visuals.mergeAnimations.filter(
          (anim) => now - anim.startTime < anim.duration
        );
        // Also clean up expired vortexes
        state.entities.vortexes = state.entities.vortexes.filter(
          (vortex) => now - vortex.startTime < vortex.duration
        );
        meta.lastCleanupTick = meta.tickCount;
      }

      // 14. CHECK ACHIEVEMENTS (every 20 ticks)
      if (meta.tickCount % 20 === 0) {
        checkStateAchievements(state);
      }

      // 15. AUTO-SAVE (every 5 seconds)
      if (meta.tickCount - meta.lastSaveTick >= GAME_TIMING.SAVE_TICKS) {
        saveGame(state);
        state.core.lastSave = now;
        meta.lastSaveTick = meta.tickCount;
      }

      // 15. TRIGGER RENDER
      triggerRender();
    }, GAME_TIMING.TICK_MS);

    return () => clearInterval(gameLoop);
  }, [stateRef.current.core.isPaused, stateRef, triggerRender]);

  const handleEnemyClick = useCallback(
    (enemy: EnemyType) => {
      const state = stateRef.current;
      if (state.core.isPaused) return;

      const now = Date.now();
      const clickDmgMultiplier = getDamageMultiplier(state.core.activePowerUps, now);
      const clickGoldMultiplier = getGoldMultiplier(state.core.activePowerUps, now);
      const clickDamage = Math.floor(state.core.clickDamage * clickDmgMultiplier);

      const { enemy: damagedEnemy, isDead } = damageEnemy(enemy, clickDamage);

      state.entities.enemies = state.entities.enemies.map((e) =>
        e.id === enemy.id ? damagedEnemy : e
      );

      if (isDead) {
        const { goldGained, goldPopups: deathPopups } = handleEnemyDeath(
          enemy,
          now,
          clickGoldMultiplier
        );
        state.entities.enemies = state.entities.enemies.filter(
          (e) => e.id !== enemy.id
        );
        state.core.gold += goldGained;
        state.core.totalGoldEarned += goldGained;
        state.core.totalEnemiesKilled++;
        state.visuals.goldPopups.push(...deathPopups);
        if (enemy.isGiant) tryUnlockAchievement("giant_killer", state);
      }

      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handlePowerUpClick = useCallback(() => {
    const state = stateRef.current;
    const spawned = state.entities.spawnedPowerUp;
    if (!spawned) return;

    const def = getPowerUpDef(spawned.powerUpId);
    if (!def) return;

    const now = Date.now();

    // Compute amounts before applyEffect mutates state
    const goldAmount = getGoldDropAmount(state, def.id);
    const xpAmount = getXpDropAmount(state, def.id);

    // Resolve element type for element-specific buffs (before applyEffect)
    const elementType = def.resolveElementType?.(state);

    // Track power-up collection
    state.core.totalPowerUpsCollected += 1;
    if (!state.core.collectedPowerUpTypes.includes(def.id)) {
      state.core.collectedPowerUpTypes.push(def.id);
    }

    // Apply the effect
    def.applyEffect(state);

    // If duration buff, add to active power-ups
    if (def.duration > 0) {
      state.core.activePowerUps.push({
        id: `active_${now}_${Math.random().toString(36).substr(2, 9)}`,
        powerUpId: def.id,
        startTime: now,
        duration: def.duration,
        elementType,
      });
    }

    // Instant gold power-ups show standard gold popup
    if (goldAmount > 0) {
      state.visuals.goldPopups.push({
        id: `gold_${now}_${Math.random()}`,
        x: spawned.x,
        y: spawned.y,
        amount: goldAmount,
        startTime: now,
      });
    }

    // Instant XP power-ups show XP popup
    if (xpAmount > 0) {
      state.visuals.xpPopups.push({
        id: `xp_${now}_${Math.random()}`,
        x: spawned.x,
        y: spawned.y,
        amount: xpAmount,
        startTime: now,
      });
    }

    // Remove from battlefield
    state.entities.spawnedPowerUp = null;
    triggerRender();
  }, [stateRef, triggerRender]);

  const handleGoldPopupComplete = useCallback(
    (id: string) => {
      stateRef.current.visuals.goldPopups =
        stateRef.current.visuals.goldPopups.filter((p) => p.id !== id);
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleXpPopupComplete = useCallback(
    (id: string) => {
      stateRef.current.visuals.xpPopups =
        stateRef.current.visuals.xpPopups.filter((p) => p.id !== id);
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

  const handleMergeComplete = useCallback(
    (id: string) => {
      stateRef.current.visuals.mergeAnimations =
        stateRef.current.visuals.mergeAnimations.filter((a) => a.id !== id);
      triggerRender();
    },
    [stateRef, triggerRender]
  );

  const handleAchievementPopupComplete = useCallback(() => {
    stateRef.current.visuals.achievementQueue.shift();
    triggerRender();
  }, [stateRef, triggerRender]);

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
          <Defender
            key={defender.id}
            {...defender}
            mageProgress={core.mageProgress[defender.type]}
          />
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

        {entities.spawnedPowerUp && (
          <SpawnedPowerUpComponent
            powerUp={entities.spawnedPowerUp}
            onClick={handlePowerUpClick}
          />
        )}

        <ActiveBuffsHUD activePowerUps={core.activePowerUps} />

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

        {visuals.xpPopups.map((popup) => (
          <XpPopup
            key={popup.id}
            id={popup.id}
            x={popup.x}
            y={popup.y}
            amount={popup.amount}
            onComplete={() => handleXpPopupComplete(popup.id)}
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

        {visuals.mergeAnimations?.map((animation) => (
          <MergeAnimationComponent
            key={animation.id}
            animation={animation}
            onComplete={handleMergeComplete}
          />
        ))}

        {visuals.achievementQueue.length > 0 && (
          <AchievementPopup
            achievementId={visuals.achievementQueue[0]}
            onComplete={handleAchievementPopupComplete}
          />
        )}
      </div>
    </div>
  );
};

export default GameArea;
