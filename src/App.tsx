import { useEffect } from "react";
import "./App.css";
import GameHeader from "./components/GameHeader";
import GameArea from "./components/GameArea";
import GameSidebar from "./components/GameSidebar";
import { useGameStateRef } from "./hooks/useGameStateRef";
import { createInitialGameState } from "./utils/initialState";
import { saveGame, loadGame, clearSave } from "./utils/saveSystem";
import type { GameState } from "./types/GameStateSlices";

function App() {
  const { stateRef, triggerRender } = useGameStateRef<GameState>(
    createInitialGameState(true) // dev mode = true for 500 starting gold
  );

  // Timer - increment time survived every second
  useEffect(() => {
    const timerLoop = setInterval(() => {
      if (stateRef.current.core.isPaused) return;
      stateRef.current.core.timeSurvived += 1;
      triggerRender();
    }, 1000);

    return () => clearInterval(timerLoop);
  }, [stateRef, triggerRender]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame(stateRef.current);
      stateRef.current.core.lastSave = Date.now();
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [stateRef]);

  // Load save on mount
  useEffect(() => {
    const savedGameState = loadGame();
    if (savedGameState) {
      console.log(
        "Loading saved game state, difficulty level:",
        savedGameState.core.difficultyLevel
      );
      stateRef.current = savedGameState;
      triggerRender();
    } else {
      console.log("No saved game found, using default difficulty level: 1");
    }
  }, [stateRef, triggerRender]);

  const togglePause = () => {
    stateRef.current.core.isPaused = !stateRef.current.core.isPaused;
    triggerRender();
  };

  const resetGame = () => {
    clearSave();
    stateRef.current = createInitialGameState(true); // dev mode
    triggerRender();
  };

  const addDevGold = () => {
    stateRef.current.core.gold += 10000;
    triggerRender();
  };

  return (
    <div className="App">
      <GameHeader
        stateRef={stateRef}
        onPauseToggle={togglePause}
        onReset={resetGame}
        onDevGold={addDevGold}
      />
      <div className="game-container">
        <GameArea stateRef={stateRef} triggerRender={triggerRender} />
        <GameSidebar stateRef={stateRef} triggerRender={triggerRender} />
      </div>
    </div>
  );
}

export default App;
