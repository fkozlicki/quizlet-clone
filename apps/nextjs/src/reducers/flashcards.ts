import type { RouterOutputs } from "@acme/api";

export const flashcardsInitial = {
  flashcards: [] as RouterOutputs["studySet"]["byId"]["flashcards"],
  cardIndex: 0,
  hard: [] as RouterOutputs["studySet"]["byId"]["flashcards"],
  sorting: false,
  starredOnly: false,
  settingsOpen: false,
  know: false,
};

type FlashcardsGameState = typeof flashcardsInitial;
type FlashcardsGameAction =
  | { type: "setCards"; payload: FlashcardsGameState["flashcards"] }
  | { type: "setSorting"; payload: FlashcardsGameState["sorting"] }
  | { type: "nextCard" }
  | { type: "prevCard" }
  | { type: "reset"; payload: FlashcardsGameState["flashcards"] }
  | { type: "reviewHard" }
  | { type: "addHard"; payload: FlashcardsGameState["flashcards"][0] }
  | { type: "setSettingsOpen"; payload: FlashcardsGameState["settingsOpen"] }
  | { type: "shuffle" }
  | { type: "setStarredOnly"; payload: FlashcardsGameState["starredOnly"] }
  | { type: "setKnow"; payload: FlashcardsGameState["know"] };

export const flashcardsReducer = (
  state: FlashcardsGameState,
  action: FlashcardsGameAction,
): FlashcardsGameState => {
  if (action.type === "setCards") {
    return { ...state, flashcards: action.payload };
  }
  if (action.type === "nextCard") {
    return { ...state, cardIndex: state.cardIndex + 1 };
  }
  if (action.type === "prevCard") {
    return { ...state, cardIndex: state.cardIndex - 1 };
  }
  if (action.type === "setSorting") {
    return { ...state, sorting: action.payload };
  }
  if (action.type === "setKnow") {
    return { ...state, know: action.payload };
  }
  if (action.type === "reviewHard") {
    return {
      ...state,
      flashcards: state.hard,
      hard: [],
      cardIndex: 0,
    };
  }
  if (action.type === "setSettingsOpen") {
    return {
      ...state,
      settingsOpen: action.payload,
    };
  }
  if (action.type === "shuffle") {
    return {
      ...state,
      flashcards: state.flashcards.sort(() => 0.5 - Math.random()),
    };
  }
  if (action.type === "addHard") {
    return {
      ...state,
      hard: [...state.hard, action.payload],
    };
  }
  if (action.type === "reset") {
    const starredCards = action.payload.filter((card) => card.starred);
    return {
      ...flashcardsInitial,
      starredOnly: state.starredOnly,
      sorting: state.sorting,
      flashcards: state.starredOnly ? starredCards : action.payload,
    };
  }
  if (action.type === "setStarredOnly") {
    return {
      ...state,
      starredOnly: action.payload,
      cardIndex: 0,
    };
  }

  return state;
};
