"use client";

import { api } from "@/trpc/react";
import { Button, theme } from "antd";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import StartScreen from "./StartScreen";
import MemoryCard from "./MemoryCard";
import EndScreen from "./EndScreen";
import Text from "antd/es/typography/Text";
import { useAnimate } from "framer-motion";

export interface GameCard {
  flashcardId: string;
  content: string;
}

type GameState = {
  cards: GameCard[];
  selected?: number;
  matched: number[];
  ellapsedTime: number;
  stage: "initial" | "start" | "finished";
};

type GameAction =
  | { type: "setMatched"; payload: number[] }
  | { type: "setCards"; payload: GameCard[] }
  | { type: "setSelected"; payload: GameState["selected"] }
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
  selected: undefined,
  matched: [],
  stage: "initial",
  ellapsedTime: 0,
};

const MatchMode = ({ setId }: { setId: string }) => {
  const [{ cards, matched, selected, stage, ellapsedTime }, dispatch] =
    useReducer(gameReducer, initialGameState);
  const utils = api.useUtils();
  api.studySet.getMatchCards.useQuery(
    { setId },
    {
      onSuccess(data) {
        dispatch({ type: "setCards", payload: data });
      },
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const [scope, animate] = useAnimate();
  const {
    token: {
      red1,
      red5,
      green1,
      green5,
      colorBorder,
      colorBgContainer,
      blue1,
      blue5,
    },
  } = theme.useToken();

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setTimeout(() => {
        dispatch({ type: "setStage", payload: "finished" });
      }, 300);
    }
  }, [matched]);

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

  const matchAnimation = (selector: string) => {
    void animate([
      [
        selector,
        { backgroundColor: green1, borderColor: green5 },
        { duration: 0 },
      ],
      [selector, { scale: 0 }, { duration: 0.2, ease: "linear" }],
    ]);
  };

  const missmatchAnimation = async (selector: string) => {
    await animate([
      [selector, { backgroundColor: red1, borderColor: red5 }, { duration: 0 }],
      [selector, { rotate: [-2, 0, -2, 0, -2, 0] }, { duration: 0.3 }],
    ]);

    void animate(
      selector,
      { backgroundColor: colorBgContainer, borderColor: colorBorder },
      { duration: 0 },
    );
  };

  const selectCard = async (index: number) => {
    if (selected === undefined) {
      dispatch({ type: "setSelected", payload: index });
      void animate(
        `#card-${index}`,
        {
          backgroundColor: blue1,
          borderColor: blue5,
        },
        { duration: 0 },
      );
    } else {
      dispatch({ type: "setSelected", payload: undefined });
      if (selected === index) {
        void animate(
          `#card-${index}`,
          {
            backgroundColor: colorBgContainer,
            borderColor: colorBorder,
          },
          { duration: 0 },
        );
      } else {
        if (cards[selected]?.flashcardId === cards[index]?.flashcardId) {
          matchAnimation(`#card-${selected}`);
          matchAnimation(`#card-${index}`);
          dispatch({
            type: "setMatched",
            payload: [...matched, index, selected],
          });
        } else {
          void missmatchAnimation(`#card-${selected}`);
          void missmatchAnimation(`#card-${index}`);
        }
      }
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
          <div ref={scope} className="grid h-full grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <MemoryCard
                key={index}
                index={index}
                content={card.content}
                selectCallback={() => selectCard(index)}
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
