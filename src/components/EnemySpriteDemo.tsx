import React from "react";
import EnemySprite from "./EnemySprite";
import "./EnemySpriteDemo.css";

const EnemySpriteDemo: React.FC = () => {
  const enemies = [
    {
      type: "goblin" as const,
      name: "Goblin",
      description: "Fast, weak enemy",
    },
    {
      type: "orc" as const,
      name: "Orc",
      description: "Medium strength, moderate speed",
    },
    {
      type: "skeleton" as const,
      name: "Skeleton",
      description: "Undead, moderate health",
    },
    {
      type: "demon" as const,
      name: "Demon",
      description: "Powerful, slow enemy with fire aura",
    },
  ];

  return (
    <div className="enemy-sprite-demo">
      <h3>Enemy Sprites</h3>
      <div className="enemy-grid">
        {enemies.map((enemy) => (
          <div key={enemy.type} className="enemy-card">
            <EnemySprite type={enemy.type} />
            <h4>{enemy.name}</h4>
            <p>{enemy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnemySpriteDemo;
