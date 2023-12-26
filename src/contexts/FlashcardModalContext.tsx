import type { Flashcard } from "@prisma/client";
import type { Dispatch, PropsWithChildren } from "react";
import { createContext, useContext, useReducer } from "react";

type FlashcardModalState = {
  flashcard?: Flashcard;
};

type FlashcardModalAction =
  | { type: "open"; payload: FlashcardModalState["flashcard"] }
  | { type: "close" };

const flashcardModalReducer = (
  state: FlashcardModalState,
  action: FlashcardModalAction
): FlashcardModalState => {
  if (action.type === "open") {
    return {
      ...state,
      flashcard: action.payload,
    };
  }
  if (action.type === "close") {
    return { flashcard: undefined };
  }
  return state;
};

const initialState: FlashcardModalState = {
  flashcard: undefined,
};

type FlashcardModalContext = [
  FlashcardModalState,
  Dispatch<FlashcardModalAction>
];

export const FlashcardModalContext = createContext<FlashcardModalContext>([
  initialState,
  () => null,
]);

const FlashcardModalProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(flashcardModalReducer, initialState);

  return (
    <FlashcardModalContext.Provider value={[state, dispatch]}>
      {children}
    </FlashcardModalContext.Provider>
  );
};

export default FlashcardModalProvider;

export const useFlashcardModalContext = (): FlashcardModalContext =>
  useContext(FlashcardModalContext);
