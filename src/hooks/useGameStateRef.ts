import { useRef, useState, useCallback } from "react";
import type { GameState } from "../types/GameState";

export interface GameStateRefHandle {
  getState: () => GameState;
  setState: (updater: GameState | ((prev: GameState) => GameState)) => void;
  triggerRender: () => void;
  stateRef: React.MutableRefObject<GameState>;
}

export const useGameStateRef = (
  initialState: GameState
): GameStateRefHandle => {
  const stateRef = useRef<GameState>(initialState);
  const [, setRenderTrigger] = useState(0);

  const getState = useCallback(() => stateRef.current, []);

  const setState = useCallback(
    (updater: GameState | ((prev: GameState) => GameState)) => {
      if (typeof updater === "function") {
        stateRef.current = updater(stateRef.current);
      } else {
        stateRef.current = updater;
      }
    },
    []
  );

  const triggerRender = useCallback(() => {
    setRenderTrigger((t) => t + 1);
  }, []);

  return { getState, setState, triggerRender, stateRef };
};
