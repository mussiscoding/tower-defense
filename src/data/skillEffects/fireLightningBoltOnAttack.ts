import type { Defender, Enemy, SkillContext } from "../../types/GameState";

// Fire Lightning Bolt onAttack handler - instantly kills highest HP enemy on map
export const fireLightningBoltOnAttack = (
  _defender: Defender,
  _target: Enemy, // This target is ignored - we find our own
  context: SkillContext
) => {
  // Find the enemy with the highest current health
  const highestHpEnemy = context.enemies.reduce((highest, current) => {
    return current.health > highest.health ? current : highest;
  }, context.enemies[0]);

  if (!highestHpEnemy) {
    return; // No enemies on map
  }

  // Instantly kill the highest HP enemy by setting health to 0
  highestHpEnemy.health = 0;

  // TODO: Add visual lightning bolt effect here when we implement visual effects
  console.log(
    `⚡ Lightning bolt struck ${highestHpEnemy.id} for instant kill!`
  );
};
