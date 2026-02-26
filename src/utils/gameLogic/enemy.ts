import type { Enemy, GoldPopup } from "../../types/GameState";
import { GAME_DIMENSIONS } from "../../constants/gameDimensions";

export const generateEnemyId = (): string => {
  return `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

interface CreateEnemyOptions {
  isGiant?: boolean;
}

export const createEnemy = (
  x: number,
  y: number,
  health: number,
  colorIndex: number,
  options?: CreateEnemyOptions
): Enemy => {
  const isGiant = options?.isGiant ?? false;

  return {
    id: generateEnemyId(),
    x,
    y,
    health,
    maxHealth: health,
    speed: 1,
    goldValue: Math.ceil(health / 2),
    colorIndex,
    isGiant,
  };
};

export const moveEnemies = (enemies: Enemy[], currentTime: number): Enemy[] => {
  return enemies.map((enemy) => {
    let effectiveSpeed = enemy.speed;
    let vortexPullX = 0;
    let vortexPullY = 0;

    // Apply slow effect if active
    if (
      enemy.slowEffect &&
      enemy.slowEndTime &&
      currentTime < enemy.slowEndTime
    ) {
      const slowMultiplier = 1 - enemy.slowEffect / 100; // Convert percentage to multiplier
      effectiveSpeed = enemy.speed * slowMultiplier;
    }

    // Apply vortex effect if active
    if (enemy.vortexEffect && currentTime < enemy.vortexEffect.endTime) {
      // Calculate vortex pull effect
      // The pullDirectionX/Y are already normalized and scaled by pullStrength
      vortexPullX = enemy.vortexEffect.pullDirectionX;
      vortexPullY = enemy.vortexEffect.pullDirectionY;
    }

    // Calculate final position
    const newX = enemy.x - effectiveSpeed + vortexPullX;
    const newY = enemy.y + vortexPullY;

    return {
      ...enemy,
      x: newX,
      y: newY,
    };
  });
};

export const removeDeadEnemies = (enemies: Enemy[]): Enemy[] => {
  return enemies.filter((enemy) => enemy.health > 0);
};

export const removeEnemiesPastCastle = (enemies: Enemy[]): Enemy[] => {
  return enemies.filter((enemy) => enemy.x > GAME_DIMENSIONS.CASTLE_WIDTH); // Castle is at x=75
};

export const damageEnemy = (
  enemy: Enemy,
  damage: number
): { enemy: Enemy; isDead: boolean } => {
  const newHealth = Math.max(0, enemy.health - damage);
  return {
    enemy: { ...enemy, health: newHealth },
    isDead: newHealth <= 0,
  };
};

export const damageCastle = (
  enemies: Enemy[],
  currentCastleHealth: number
): { castleHealth: number; enemies: Enemy[]; castleDestroyed: boolean } => {
  const enemiesAtCastle = enemies.filter(
    (enemy) => enemy.x <= GAME_DIMENSIONS.CASTLE_WIDTH
  );
  const damage = enemiesAtCastle.length * 5; // 5 damage per enemy
  const newCastleHealth = Math.max(0, currentCastleHealth - damage);
  const castleDestroyed = newCastleHealth <= 0;

  // Remove enemies that reached the castle (unless castle is destroyed, then remove all)
  const remainingEnemies = castleDestroyed
    ? []
    : enemies.filter((enemy) => enemy.x > GAME_DIMENSIONS.CASTLE_WIDTH);

  return {
    castleHealth: newCastleHealth,
    enemies: remainingEnemies,
    castleDestroyed,
  };
};

export const handleEnemyDeath = (
  enemy: Enemy,
  currentTime: number,
  goldMultiplier: number = 1
): { goldGained: number; goldPopups: GoldPopup[] } => {
  const goldGained = Math.floor(enemy.goldValue * goldMultiplier);
  const goldPopups = [
    {
      id: `gold_${currentTime}_${Math.random()}`,
      x: enemy.x,
      y: enemy.y,
      amount: goldGained,
      startTime: currentTime,
    },
  ];

  return { goldGained, goldPopups };
};

// Helper function to update vortex effects and clean up expired ones
export const updateVortexEffectsInGameLoop = (
  enemies: Enemy[],
  currentTime: number
): Enemy[] => {
  return enemies.map((enemy) => {
    // If enemy has no vortex effect, return as is
    if (!enemy.vortexEffect) return enemy;

    // Check if vortex effect has expired
    if (currentTime >= enemy.vortexEffect.endTime) {
      // Remove expired vortex effect
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { vortexEffect, ...enemyWithoutVortex } = enemy;
      return enemyWithoutVortex;
    }

    // Vortex effect is still active, keep it
    return enemy;
  });
};
