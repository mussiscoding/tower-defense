import { useRef, useState, useCallback } from "react";

export interface GameStateRefHandle<T> {
  getState: () => T;
  setState: (updater: T | ((prev: T) => T)) => void;
  triggerRender: () => void;
  stateRef: React.MutableRefObject<T>;
}

export const useGameStateRef = <T>(initialState: T): GameStateRefHandle<T> => {
  const stateRef = useRef<T>(initialState);
  const [, setRenderTrigger] = useState(0);

  const getState = useCallback(() => stateRef.current, []);

  const setState = useCallback((updater: T | ((prev: T) => T)) => {
    if (typeof updater === "function") {
      stateRef.current = (updater as (prev: T) => T)(stateRef.current);
    } else {
      stateRef.current = updater;
    }
  }, []);

  const triggerRender = useCallback(() => {
    setRenderTrigger((t) => t + 1);
  }, []);

  return { getState, setState, triggerRender, stateRef };
};
