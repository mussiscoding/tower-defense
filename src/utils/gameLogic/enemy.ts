import type { Enemy, GoldPopup } from "../../types/GameState";
import { getAvailableEnemies, fallbackEnemy } from "../../data/enemies";

export const generateEnemyId = (): string => {
  return `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createEnemy = (
  x: number,
  y: number,
  difficultyLevel: number
): Enemy => {
  // Get available enemies based on difficulty level
  const availableEnemies = getAvailableEnemies(difficultyLevel);

  if (availableEnemies.length === 0) {
    availableEnemies.push(fallbackEnemy);
  }

  // Randomly select an available enemy
  const selectedEnemy =
    availableEnemies[Math.floor(Math.random() * availableEnemies.length)];

  return {
    id: generateEnemyId(),
    x,
    y,
    health: selectedEnemy.health,
    maxHealth: selectedEnemy.health,
    speed: selectedEnemy.speed,
    goldValue: selectedEnemy.goldValue,
    type: selectedEnemy.type,
  };
};

export const moveEnemies = (enemies: Enemy[], currentTime: number): Enemy[] => {
  return enemies.map((enemy) => {
    let effectiveSpeed = enemy.speed;

    // Apply slow effect if active
    if (
      enemy.slowEffect &&
      enemy.slowEndTime &&
      currentTime < enemy.slowEndTime
    ) {
      const slowMultiplier = 1 - enemy.slowEffect / 100; // Convert percentage to multiplier
      effectiveSpeed = enemy.speed * slowMultiplier;
    }

    return {
      ...enemy,
      x: enemy.x - effectiveSpeed,
    };
  });
};

export const removeDeadEnemies = (enemies: Enemy[]): Enemy[] => {
  return enemies.filter((enemy) => enemy.health > 0);
};

export const removeEnemiesPastCastle = (enemies: Enemy[]): Enemy[] => {
  return enemies.filter((enemy) => enemy.x > 50); // Castle is at x=50
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
  const enemiesAtCastle = enemies.filter((enemy) => enemy.x <= 50);
  const damage = enemiesAtCastle.length * 5; // 5 damage per enemy
  const newCastleHealth = Math.max(0, currentCastleHealth - damage);
  const castleDestroyed = newCastleHealth <= 0;

  // Remove enemies that reached the castle (unless castle is destroyed, then remove all)
  const remainingEnemies = castleDestroyed
    ? []
    : enemies.filter((enemy) => enemy.x > 50);

  return {
    castleHealth: newCastleHealth,
    enemies: remainingEnemies,
    castleDestroyed,
  };
};

export const handleEnemyDeath = (
  enemy: Enemy,
  currentTime: number
): { goldGained: number; goldPopups: GoldPopup[] } => {
  const goldGained = enemy.goldValue;
  const goldPopups = [
    {
      id: `gold_${currentTime}_${Math.random()}`,
      x: enemy.x,
      y: enemy.y,
      amount: enemy.goldValue,
      startTime: currentTime,
    },
  ];

  return { goldGained, goldPopups };
};
