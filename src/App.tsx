import { useState, useEffect } from "react";
import "./App.css";
import GameHeader from "./components/GameHeader";
import GameArea from "./components/GameArea";
import GameSidebar from "./components/GameSidebar";
import type { GameState } from "./types/GameState";
import { saveGame, loadGame, clearSave } from "./utils/saveSystem";
import {
  getAvailableElements,
  createInitialElementData,
} from "./data/elements";
import type { ElementData } from "./types/GameState";

function App() {
  const [gameState, setGameState] = useState<GameState>({
    gold: 0,
    castleHealth: 100,
    timeSurvived: 0,
    clickDamage: 1,
    defenders: [],
    enemies: [],
    arrows: [],
    goldPopups: [],
    splashEffects: [],
    levelUpAnimations: [],
    floatingTexts: [],
    upgradeAnimations: [],
    damageNumbers: [],
    lastSave: Date.now(),
    isPaused: false,
    purchases: {},
    difficultyLevel: 1,
    predictedArrowDamage: new Map(),
    predictedBurnDamage: new Map(),
    elements: getAvailableElements().reduce((acc, elementType) => {
      acc[elementType] = createInitialElementData(elementType);
      return acc;
    }, {} as Record<string, ElementData>),
  });

  // Game loop
  useEffect(() => {
    if (gameState.isPaused) return;

    const gameLoop = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        timeSurvived: prev.timeSurvived + 1,
      }));
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [gameState.isPaused]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      setGameState((prev) => {
        saveGame(prev);
        return { ...prev, lastSave: Date.now() };
      });
    }, 5000);

    return () => clearInterval(saveInterval);
  }, []); // Empty dependency array - only run once on mount

  // Load save on mount
  useEffect(() => {
    const savedGameState = loadGame();
    if (savedGameState) {
      console.log(
        "Loading saved game state, difficulty level:",
        savedGameState.difficultyLevel
      );
      setGameState(savedGameState);
    } else {
      console.log("No saved game found, using default difficulty level: 1");
    }
  }, []);

  const togglePause = () => {
    setGameState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const resetGame = () => {
    clearSave();
    setGameState({
      gold: 500, // dev only
      castleHealth: 100,
      timeSurvived: 0,
      clickDamage: 1,
      defenders: [],
      enemies: [],
      arrows: [],
      goldPopups: [],
      splashEffects: [],
      levelUpAnimations: [],
      floatingTexts: [],
      upgradeAnimations: [],
      damageNumbers: [],
      lastSave: Date.now(),
      isPaused: false,
      purchases: {},
      difficultyLevel: 1,
      predictedArrowDamage: new Map(),
      predictedBurnDamage: new Map(),
      elements: getAvailableElements().reduce((acc, elementType) => {
        acc[elementType] = createInitialElementData(elementType);
        return acc;
      }, {} as Record<string, ElementData>),
    });
  };

  const addDevGold = () => {
    setGameState((prev) => ({
      ...prev,
      gold: prev.gold + 10000,
    }));
  };

  return (
    <div className="App">
      <GameHeader
        gameState={gameState}
        onPauseToggle={togglePause}
        onReset={resetGame}
        onDevGold={addDevGold}
      />
      <div className="game-container">
        <GameArea gameState={gameState} setGameState={setGameState} />
        <GameSidebar gameState={gameState} setGameState={setGameState} />
      </div>
    </div>
  );
}

export default App;
