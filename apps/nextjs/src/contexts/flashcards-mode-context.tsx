"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

import { useFlashcardsMode } from "~/hooks/use-flashcards-mode";

type FlashcardsModeContext = ReturnType<typeof useFlashcardsMode>;

const FlashcardsModeContext = createContext<FlashcardsModeContext | undefined>(
  undefined,
);

export default function FlashcardsModeProvider({
  children,
  id,
}: PropsWithChildren & { id: string }) {
  const value = useFlashcardsMode(id);

  return (
    <FlashcardsModeContext.Provider value={value}>
      {children}
    </FlashcardsModeContext.Provider>
  );
}

export const useFlashcardsModeContext = () => {
  const context = useContext(FlashcardsModeContext);

  if (!context) {
    throw new Error("Missing FlashcardsModeContext");
  }

  return context;
};
