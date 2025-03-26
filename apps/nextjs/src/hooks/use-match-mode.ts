import { useEffect } from "react";

import { api } from "~/trpc/react";
import { useMatchModeReducer } from "./use-match-mode-reducer";

export function useMatchMode(id: string) {
  const utils = api.useUtils();

  const [cards] = api.studySet.matchCards.useSuspenseQuery(
    { id },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const [{ matched, selected, screen, mismatched, ellapsedTime }, dispatch] =
    useMatchModeReducer();

  useEffect(() => {
    if (matched.length === cards.length) {
      setTimeout(() => {
        dispatch({ type: "SET_SCREEN", payload: "result" });
      }, 200);
    }
  }, [matched.length, cards.length]);

  useEffect(() => {
    const [first, second] = selected;

    if (first === undefined || second === undefined) {
      return;
    }

    if (cards[first]?.flashcardId === cards[second]?.flashcardId) {
      dispatch({ type: "MARK_MATCH", payload: selected });
    } else {
      dispatch({ type: "MARK_MISMATCH", payload: selected });
      setTimeout(() => {
        dispatch({ type: "MARK_MISMATCH", payload: [] });
      }, 220);
    }
  }, [selected, cards]);

  const selectCard = (index: number) => {
    if (selected.includes(index)) {
      dispatch({ type: "DESELECT" });
    } else {
      dispatch({ type: "SELECT", payload: index });
    }
  };

  const start = () => {
    dispatch({ type: "SET_SCREEN", payload: "play" });
  };

  const reset = async () => {
    await utils.studySet.matchCards.invalidate();

    dispatch({ type: "RESET" });
  };

  const setEllapsedTime = (time: number) => {
    dispatch({ type: "SET_ELLAPSED_TIME", payload: time });
  };

  return {
    screen,
    cards,
    selected,
    matched,
    mismatched,
    ellapsedTime,
    selectCard,
    start,
    reset,
    setEllapsedTime,
  };
}
