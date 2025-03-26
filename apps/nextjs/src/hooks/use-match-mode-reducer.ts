import { useReducer } from "react";

interface MemoeryGameState {
  selected: number[];
  matched: number[];
  mismatched: number[];
  ellapsedTime: number;
  screen: "initial" | "play" | "result";
}

type MemoryGameAction =
  | { type: "MARK_MATCH"; payload: number[] }
  | { type: "SELECT"; payload: number }
  | { type: "DESELECT" }
  | { type: "MARK_MISMATCH"; payload: number[] }
  | { type: "SET_SCREEN"; payload: "initial" | "play" | "result" }
  | { type: "SET_ELLAPSED_TIME"; payload: number }
  | { type: "RESET" };

export const memoryGameInitial: MemoeryGameState = {
  matched: [],
  selected: [],
  mismatched: [],
  screen: "initial",
  ellapsedTime: 0,
};

export const memoryGameReducer = (
  state: MemoeryGameState,
  action: MemoryGameAction,
): MemoeryGameState => {
  if (action.type === "SELECT") {
    return { ...state, selected: [...state.selected, action.payload] };
  }
  if (action.type === "DESELECT") {
    return { ...state, selected: [] };
  }
  if (action.type === "MARK_MATCH") {
    return {
      ...state,
      matched: [...state.matched, ...action.payload],
      selected: [],
    };
  }
  if (action.type === "MARK_MISMATCH") {
    return {
      ...state,
      mismatched: action.payload,
      selected: [],
    };
  }
  if (action.type === "SET_SCREEN") {
    return { ...state, screen: action.payload };
  }
  if (action.type === "SET_ELLAPSED_TIME") {
    return { ...state, ellapsedTime: action.payload };
  }
  return { ...memoryGameInitial, screen: "play" };
};

export const useMatchModeReducer = () =>
  useReducer(memoryGameReducer, memoryGameInitial);
