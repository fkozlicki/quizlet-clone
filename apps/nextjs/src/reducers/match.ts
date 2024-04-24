export interface MatchCard {
  flashcardId: number;
  content: string;
}

interface MatchState {
  cards: MatchCard[];
  selected?: number;
  matched: number[];
  ellapsedTime: number;
  stage: "initial" | "start" | "finished";
}

type GameAction =
  | { type: "setMatched"; payload: number[] }
  | { type: "setCards"; payload: MatchCard[] }
  | { type: "setSelected"; payload: MatchState["selected"] }
  | { type: "setMismatch"; payload: number[] }
  | { type: "setStage"; payload: "initial" | "start" | "finished" }
  | { type: "setEllapsedTime"; payload: number }
  | { type: "clear" };

export const matchInitial: MatchState = {
  cards: [],
  matched: [],
  stage: "initial",
  ellapsedTime: 0,
};

export const matchReducer = (
  state: MatchState,
  action: GameAction,
): MatchState => {
  const { type } = action;
  if (type === "setSelected") {
    return { ...state, selected: action.payload };
  }
  if (type === "setMatched") {
    return { ...state, matched: action.payload };
  }
  if (type === "setCards") {
    return { ...state, cards: action.payload };
  }
  if (type === "setStage") {
    return { ...state, stage: action.payload };
  }
  if (type === "setEllapsedTime") {
    return { ...state, ellapsedTime: action.payload };
  }
  if (type === "clear") {
    return matchInitial;
  }

  return state;
};
