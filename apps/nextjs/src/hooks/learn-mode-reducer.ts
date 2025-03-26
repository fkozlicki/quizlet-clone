import { useReducer } from "react";

export const learnModeInitial = {
  index: 0,
  disabled: false,
  correct: 0,
};

type LearnModeState = typeof learnModeInitial;

type LearnModeAction =
  | { type: "RESET" }
  | { type: "MARK_CORRECT" }
  | { type: "NEXT_CARD" }
  | { type: "DISABLE" }
  | { type: "ENABLE" };

export const learnModeReducer = (
  state: LearnModeState,
  action: LearnModeAction,
): LearnModeState => {
  if (action.type === "DISABLE") {
    return { ...state, disabled: true };
  }
  if (action.type === "ENABLE") {
    return { ...state, disabled: false };
  }
  if (action.type === "MARK_CORRECT") {
    return {
      ...state,
      correct: state.correct + 1,
    };
  }
  if (action.type === "NEXT_CARD") {
    return {
      ...state,
      index: state.index + 1,
    };
  }

  return learnModeInitial;
};

export const useLearnModeReducer = () =>
  useReducer(learnModeReducer, learnModeInitial);
