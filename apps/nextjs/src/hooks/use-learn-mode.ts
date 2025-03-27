import type { MouseEvent } from "react";

import { useLearnModeReducer } from "~/hooks/use-learn-mode-reducer";
import { api } from "~/trpc/react";

export function useLearnMode(id: string) {
  const utils = api.useUtils();
  const [flashcards] = api.studySet.learnCards.useSuspenseQuery(
    { id },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const [{ index, correct, disabled }, dispatch] = useLearnModeReducer();

  const currentCard = flashcards[index];

  const progress = (index / flashcards.length) * 100;

  const isCompleted = index === flashcards.length;

  const chooseAnswer = (idx: number, event: MouseEvent<HTMLDivElement>) => {
    if (!currentCard || disabled) {
      return;
    }

    dispatch({ type: "DISABLE" });

    const button = event.currentTarget;
    const selectedAnswer = currentCard.answers[idx];

    if (selectedAnswer === currentCard.definition) {
      button.style.background = "#bbf7d0";
      button.style.borderColor = "#16a34a";
      dispatch({ type: "MARK_CORRECT" });
    } else {
      button.style.background = "#fda4af";
      button.style.borderColor = "#e11d48";
    }

    setTimeout(() => {
      button.style.background = "hsla(var(--background))";
      button.style.borderColor = "hsla(var(--input))";
      dispatch({ type: "ENABLE" });
      dispatch({ type: "NEXT_CARD" });
    }, 1000);
  };

  const reset = async () => {
    await utils.studySet.learnCards.invalidate();
    dispatch({ type: "RESET" });
  };

  return {
    chooseAnswer,
    reset,
    currentCard,
    index,
    progress,
    isCompleted,
    flashcards,
    correct,
  };
}
