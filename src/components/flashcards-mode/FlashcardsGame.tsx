"use client";

import type { Flashcard } from "@prisma/client";
import { Progress } from "antd";
import { useAnimate } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import StudyModeResult from "../shared/StudyModeResult";
import FlashcardButtons from "./FlashcardButtons";
import FlashcardsSettingsModal from "./FlashcardsSettingsModal";
import FlipCard from "./FlipCard";
import MessageCard from "./MessageCard";

export type FlashcardAnimation = "left" | "right" | "know" | "learning" | null;

interface FlashcardsGameProps {
  cards: (Flashcard & { starred?: boolean })[];
  ownerId: string;
  setId: string;
  size?: "small" | "large";
}

const initialState = {
  flashcards: [] as (Flashcard & { starred?: boolean })[],
  cardIndex: 0,
  hard: [] as (Flashcard & { starred?: boolean })[],
  sorting: false,
  starredOnly: false,
  settingsOpen: false,
  know: false,
};

type FlashcardsGameState = typeof initialState;
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

const gameReducer = (
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
      ...initialState,
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

const FlashcardsGame = ({
  cards,
  ownerId,
  setId,
  size = "small",
}: FlashcardsGameProps) => {
  const [
    { cardIndex, sorting, flashcards, hard, settingsOpen, starredOnly, know },
    dispatch,
  ] = useReducer(gameReducer, {
    ...initialState,
    flashcards: cards,
  });
  const router = useRouter();
  const { data: session } = useSession();
  const [scope, animate] = useAnimate();
  const [messageScope, messageAnimate] = useAnimate();

  const starredCards = cards.filter((card) => card.starred);
  const currentCard = flashcards[cardIndex];
  const hardCount = hard.length;

  useEffect(() => {
    if (starredOnly) {
      const oldIds = flashcards.map((card) => card.id);
      const editedCards = cards.filter((card) => oldIds.includes(card.id));
      dispatch({
        type: "setCards",
        payload: editedCards,
      });
    } else {
      dispatch({
        type: "setCards",
        payload: cards,
      });
    }

    if (starredOnly && starredCards.length === 0) {
      dispatch({ type: "setStarredOnly", payload: false });
    }
  }, [cards]);

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
    router.push(`/study-set/${setId}/learn`);
  };

  const resetFlashcards = () => {
    dispatch({ type: "reset", payload: cards });
  };

  const backToStudySet = () => {
    router.push(`/study-set/${setId}`);
  };

  const firstButton = {
    text:
      hardCount > 0
        ? "Review the tough terms"
        : size === "small"
          ? "Learn flashcards"
          : "Back to set",
    description:
      hardCount > 0
        ? `Review Flashcards again with the ${hardCount} terms you're still learing.`
        : size === "small"
          ? "Learn flashcards"
          : "Get back to the study set.",
    callback:
      hardCount > 0
        ? reviewToughTerms
        : size === "small"
          ? learnFlashcards
          : backToStudySet,
    Icon: (
      <Image
        src={size === "small" ? "/study.png" : "/back.svg"}
        alt=""
        width={48}
        height={48}
      />
    ),
  };

  const secondButton = {
    text: "Reset Flashcards",
    description: `Study all ${
      starredOnly ? starredCards.length : cards.length
    } terms from the beginning.`,
    callback: resetFlashcards,
    Icon: <Image src="/back.svg" alt="" width={48} height={48} />,
  };

  if (!currentCard) {
    return (
      <StudyModeResult
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
      addToHard();
      changeCard(1);
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
    } else {
      changeCard(-1);
      void animate(
        scope.current,
        { rotateY: [15, 0], translateX: [-60, 0] },
        { duration: 0.15 },
      );
    }
  };

  const handleRight = async () => {
    changeCard(1);
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
    dispatch({ type: "setCards", payload: value ? starredCards : cards });
  };

  return (
    <>
      <div className="relative flex [perspective:1000px]">
        {sorting && <MessageCard know={know} animationScope={messageScope} />}
        <FlipCard
          size={size}
          flashcard={currentCard}
          editable={ownerId === session?.user.id}
          animationScope={scope}
        />
      </div>
      <FlashcardButtons
        setId={setId}
        cardCount={flashcards.length}
        cardIndex={cardIndex}
        sorting={sorting}
        handleLeft={handleLeft}
        handleRight={handleRight}
        openSettingsModal={openSettingsModal}
        shuffle={shuffle}
      />
      <Progress
        percent={(cardIndex / flashcards.length) * 100}
        showInfo={false}
        size="small"
        className="mb-6"
      />
      <FlashcardsSettingsModal
        open={settingsOpen}
        onCancel={closeSettingsModal}
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
