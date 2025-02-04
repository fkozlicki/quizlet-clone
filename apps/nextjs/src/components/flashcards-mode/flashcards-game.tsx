"use client";

import { useEffect, useReducer } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAnimate } from "framer-motion";
import { GraduationCap, RotateCcw, Undo2 } from "lucide-react";

import type { Session } from "@acme/auth";
import { Progress } from "@acme/ui/progress";

import { flashcardsInitial, flashcardsReducer } from "~/reducers/flashcards";
import { api } from "~/trpc/react";
import GameResult from "../shared/game-result";
import FlashcardsGameButtons from "./flashcards-game-buttons";
import FlashcardsGameSettingsDialog from "./flashcards-game-settings-dialog";
import FlipCard from "./flip-card";
import MessageCard from "./message-card";

export type FlashcardAnimation = "left" | "right" | "know" | "learning" | null;

interface FlashcardsGameProps {
  session: Session | null;
  fullscreen?: boolean;
}

const FlashcardsGame = ({ fullscreen, session }: FlashcardsGameProps) => {
  const { id }: { id: string } = useParams();
  const [data] = api.studySet.byId.useSuspenseQuery({ id });
  const { flashcards: initialFlashcards, userId } = data;
  const [
    { cardIndex, sorting, flashcards, hard, settingsOpen, starredOnly, know },
    dispatch,
  ] = useReducer(flashcardsReducer, {
    ...flashcardsInitial,
    flashcards: initialFlashcards,
  });
  const router = useRouter();
  const [scope, animate] = useAnimate();
  const [messageScope, messageAnimate] = useAnimate();

  const starredCards = initialFlashcards.filter((card) => card.starred);
  const currentCard = flashcards[cardIndex];
  const hardCount = hard.length;

  useEffect(() => {
    if (starredOnly) {
      const oldIds = flashcards.map((card) => card.id);
      const editedCards = initialFlashcards.filter((card) =>
        oldIds.includes(card.id),
      );
      dispatch({
        type: "setCards",
        payload: editedCards,
      });
    } else {
      dispatch({
        type: "setCards",
        payload: initialFlashcards,
      });
    }

    if (starredOnly && starredCards.length === 0) {
      dispatch({ type: "setStarredOnly", payload: false });
    }
  }, [initialFlashcards]);

  useEffect(() => {
    const sortingValue = localStorage.getItem("flashcardSorting");
    if (sortingValue) {
      dispatch({
        type: "setSorting",
        payload: JSON.parse(sortingValue) as boolean,
      });
    }
  }, []);

  const reviewToughTerms = () => {
    dispatch({ type: "reviewHard" });
  };

  const learnFlashcards = () => {
    router.push(`/study-sets/${id}/learn`);
  };

  const resetFlashcards = () => {
    dispatch({ type: "reset", payload: initialFlashcards });
  };

  const backToStudySet = () => {
    router.push(`/study-sets/${id}`);
  };

  const firstButton = {
    text:
      hardCount > 0
        ? "Review the tough terms"
        : !fullscreen
          ? "Learn flashcards"
          : "Back to set",
    description:
      hardCount > 0
        ? `Review Flashcards again with the ${hardCount} terms you're still learing.`
        : !fullscreen
          ? "Learn flashcards"
          : "Get back to the study set.",
    callback:
      hardCount > 0
        ? reviewToughTerms
        : !fullscreen
          ? learnFlashcards
          : backToStudySet,
    Icon: !fullscreen ? <GraduationCap size={42} /> : <Undo2 size={32} />,
  };

  const secondButton = {
    text: "Reset Flashcards",
    description: `Study all ${
      starredOnly ? starredCards.length : initialFlashcards.length
    } terms from the beginning.`,
    callback: resetFlashcards,
    Icon: <RotateCcw size={32} />,
  };

  if (!currentCard) {
    return (
      <GameResult
        hard={hardCount}
        cardCount={flashcards.length}
        firstButton={firstButton}
        secondButton={secondButton}
      />
    );
  }

  const changeCard = (value: -1 | 1) => {
    dispatch({ type: value === 1 ? "nextCard" : "prevCard" });
  };

  const addToHard = () => {
    dispatch({ type: "addHard", payload: currentCard });
  };

  const handleLeft = async () => {
    if (sorting) {
      dispatch({ type: "setKnow", payload: false });
      await messageAnimate(
        messageScope.current,
        {
          opacity: [0, 1, 1, 0],
          visibility: "visible",
          rotate: [0, 2, 2, 0],
          translateX: [0, 0, 0, -50],
        },
        {
          ease: "linear",
          duration: 0.5,
        },
      );
      await messageAnimate(
        messageScope.current,
        { visibility: "hidden" },
        { duration: 0 },
      );
      addToHard();
      changeCard(1);
    } else {
      void animate(
        scope.current,
        { rotateY: [15, 0], translateX: [-60, 0] },
        { duration: 0.15 },
      );
      changeCard(-1);
    }
  };

  const handleRight = async () => {
    if (sorting) {
      dispatch({ type: "setKnow", payload: true });
      await messageAnimate(
        messageScope.current,
        {
          opacity: [0, 1, 1, 0],
          visibility: "visible",
          rotate: [0, -2, -2, 0],
          translateX: [0, 0, 0, 50],
        },
        { ease: "linear", duration: 0.5 },
      );
      await messageAnimate(
        messageScope.current,
        { visibility: "hidden" },
        { duration: 0 },
      );
    } else {
      void animate(
        scope.current,
        { translateX: [60, 0], rotateY: [-15, 0] },
        { duration: 0.15 },
      );
    }
    changeCard(1);
  };

  const openSettingsModal = () => {
    dispatch({ type: "setSettingsOpen", payload: true });
  };

  const closeSettingsModal = () => {
    dispatch({ type: "setSettingsOpen", payload: false });
  };

  const switchSorting = (value: boolean) => {
    dispatch({ type: "setSorting", payload: value });
    localStorage.setItem("flashcardSorting", JSON.stringify(value));
  };

  const shuffle = () => {
    dispatch({ type: "shuffle" });
  };

  const switchStarredOnly = (value: boolean) => {
    dispatch({ type: "setStarredOnly", payload: value });
    dispatch({
      type: "setCards",
      payload: value ? starredCards : initialFlashcards,
    });
  };

  return (
    <>
      <div className="relative flex [perspective:1000px]">
        {sorting && <MessageCard know={know} animationScope={messageScope} />}
        <FlipCard
          fullscreen={fullscreen}
          flashcard={currentCard}
          editable={userId === session?.user.id}
          animationScope={scope}
          session={session}
        />
      </div>
      <FlashcardsGameButtons
        setId={id}
        cardCount={flashcards.length}
        cardIndex={cardIndex}
        sorting={sorting}
        handleLeft={handleLeft}
        handleRight={handleRight}
        openSettingsModal={openSettingsModal}
        shuffle={shuffle}
        fullscreen={fullscreen}
      />
      <Progress
        value={(cardIndex / flashcards.length) * 100}
        className="mb-6"
      />
      <FlashcardsGameSettingsDialog
        open={settingsOpen}
        onOpenChange={closeSettingsModal}
        sorting={sorting}
        switchSorting={switchSorting}
        resetFlashcards={resetFlashcards}
        starredOnly={starredOnly}
        switchStarredOnly={switchStarredOnly}
        disableStarredOnly={starredCards.length === 0}
      />
    </>
  );
};

export default FlashcardsGame;
