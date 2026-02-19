import { useEffect } from "react";
import "./App.css";
import GameHeader from "./components/GameHeader";
import GameArea from "./components/GameArea";
import GameSidebar from "./components/GameSidebar";
import { useGameStateRef } from "./hooks/useGameStateRef";
import { createInitialGameState } from "./utils/initialState";
import { loadGame, clearSave } from "./utils/saveSystem";
import type { GameState } from "./types/GameStateSlices";

function App() {
  const { stateRef, triggerRender } = useGameStateRef<GameState>(
    createInitialGameState(true) // dev mode = true for 500 starting gold
  );

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
