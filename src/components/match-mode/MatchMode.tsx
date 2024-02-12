"use client";

import { api } from "@/trpc/react";
import { Button } from "antd";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import StartScreen from "./StartScreen";
import MemoryCard from "./MemoryCard";
import EndScreen from "./EndScreen";
import Text from "antd/es/typography/Text";

export interface GameCard {
  flashcardId: string;
  content: string;
}

type GameState = {
  cards: GameCard[];
  selected: number[];
  matched: number[];
  // storing mismatch for animation (1000ms)
  mismatch: number[];
  ellapsedTime: number;
  stage: "initial" | "start" | "finished";
};

type GameAction =
  | { type: "setMatched"; payload: number[] }
  | { type: "setCards"; payload: GameCard[] }
  | { type: "setSelected"; payload: number[] }
  | { type: "setMismatch"; payload: number[] }
  | { type: "startTimer" }
  | { type: "setStage"; payload: "initial" | "start" | "finished" }
  | { type: "clear" };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  const { type } = action;
  if (type === "setSelected") {
    return { ...state, selected: action.payload };
  }
  if (type === "setMatched") {
    return { ...state, matched: action.payload };
  }
  if (type === "setMismatch") {
    return { ...state, mismatch: action.payload };
  }
  if (type === "setCards") {
    return { ...state, cards: action.payload };
  }
  if (type === "startTimer") {
    return { ...state, ellapsedTime: state.ellapsedTime + 0.1 };
  }
  if (type === "setStage") {
    return { ...state, stage: action.payload };
  }
  if (type === "clear") {
    return initialGameState;
  }

  return state;
};

const initialGameState: GameState = {
  cards: [],
  selected: [],
  matched: [],
  mismatch: [],
  stage: "initial",
  ellapsedTime: 0,
};

const MatchMode = ({ setId }: { setId: string }) => {
  const [
    { cards, matched, mismatch, selected, stage, ellapsedTime },
    dispatch,
  ] = useReducer(gameReducer, initialGameState);
  const utils = api.useUtils();
  api.studySet.getMatchCards.useQuery(
    { setId },
    {
      onSuccess(data) {
        dispatch({ type: "setCards", payload: data });
      },
    },
  );

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setTimeout(() => {
        dispatch({ type: "setStage", payload: "finished" });
      }, 300);
    }
  }, [matched, cards]);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (cards[first!]?.flashcardId === cards[second!]?.flashcardId) {
        dispatch({ type: "setMatched", payload: [...matched, ...selected] });
        dispatch({ type: "setSelected", payload: [] });
      } else {
        dispatch({ type: "setMismatch", payload: selected });
        dispatch({ type: "setSelected", payload: [] });
        setTimeout(() => {
          dispatch({ type: "setMismatch", payload: [] });
        }, 300);
      }
    }
  }, [selected, cards, matched]);

  useEffect(() => {
    const interval =
      stage === "start"
        ? setInterval(() => {
            dispatch({ type: "startTimer" });
          }, 100)
        : undefined;

    if (stage === "finished" && interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [stage]);

  const selectCard = (index: number) => {
    if (selected.length < 2 && !selected.includes(index)) {
      dispatch({ type: "setSelected", payload: [...selected, index] });
    }
  };

  const startGame = () => {
    dispatch({ type: "setStage", payload: "start" });
  };

  const playAgain = async () => {
    await utils.studySet.getMatchCards.refetch();
    dispatch({ type: "clear" });
    dispatch({ type: "setStage", payload: "start" });
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <Link href={`/study-set/${setId}`}>
          <Button type="text" size="large">
            Back to set
          </Button>
        </Link>
      </div>
      {stage === "initial" && <StartScreen startGame={startGame} />}
      {stage === "start" && (
        <>
          <Text className="mb-4 inline-block text-xl">
            {ellapsedTime.toFixed(1)} sec.
          </Text>
          <div className="grid h-full grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <MemoryCard
                key={index}
                content={card.content}
                selectCallback={() => selectCard(index)}
                isSelected={selected.includes(index)}
                isMatched={matched.includes(index)}
                isMismatch={mismatch.includes(index)}
              />
            ))}
          </div>
        </>
      )}
      {stage === "finished" && (
        <EndScreen time={ellapsedTime} playAgain={playAgain} />
      )}
    </div>
  );
};

export default MatchMode;
