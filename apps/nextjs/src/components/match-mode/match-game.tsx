"use client";

import React, { useEffect, useReducer } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAnimate } from "framer-motion";

import { Button } from "@acme/ui/button";

import { matchInitial, matchReducer } from "~/reducers/match";
import { api } from "~/trpc/react";
import EndScreen from "./end-screen";
import MatchGameTimer from "./match-game-timer";
import MemoryCard from "./memory-card";
import StartScreen from "./start-screen";

const greenBorder = "#16a34a";
const greenBg = "#bbf7d0";
const redBorder = "#e11d48";
const redBg = "#fda4af";
const blueBg = "#bfdbfe";
const blueBorder = "#2563eb";

const MatchGame = () => {
  const { id }: { id: string } = useParams();
  const { data } = api.studySet.matchCards.useQuery(
    { id },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
  const [{ cards, matched, selected, stage, ellapsedTime }, dispatch] =
    useReducer(matchReducer, { ...matchInitial, cards: data! });
  const utils = api.useUtils();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setTimeout(() => {
        dispatch({ type: "setStage", payload: "finished" });
      }, 200);
    }
  }, [matched]);

  const matchAnimation = (selector: string) => {
    void animate([
      [
        selector,
        { backgroundColor: greenBg, borderColor: greenBorder },
        { duration: 0 },
      ],
      [selector, { scale: 0 }, { duration: 0.2, ease: "linear" }],
    ]);
  };

  const missmatchAnimation = async (selector: string) => {
    await animate([
      [
        selector,
        { backgroundColor: redBg, borderColor: redBorder },
        { duration: 0 },
      ],
      [selector, { rotate: [-2, 0, -2, 0, -2, 0] }, { duration: 0.2 }],
    ]);

    void animate(
      selector,
      {
        backgroundColor: "hsl(var(--background))",
        borderColor: "hsl(var(--border))",
      },
      { duration: 0 },
    );
  };

  const selectCard = async (index: number) => {
    if (selected === undefined) {
      dispatch({ type: "setSelected", payload: index });
      void animate(
        `#card-${index}`,
        {
          backgroundColor: blueBg,
          borderColor: blueBorder,
        },
        { duration: 0 },
      );
    } else {
      dispatch({ type: "setSelected", payload: undefined });
      if (selected === index) {
        void animate(
          `#card-${index}`,
          {
            backgroundColor: "",
            borderColor: "",
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
    await utils.studySet.matchCards.refetch();
    dispatch({ type: "clear" });
    dispatch({ type: "setStage", payload: "start" });
  };

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Link href={`/study-sets/${id}`}>
          <Button variant="ghost">Back to set</Button>
        </Link>
      </div>
      {stage === "initial" && <StartScreen startGame={startGame} />}
      {stage === "start" && (
        <>
          <MatchGameTimer
            updateEllapsedTime={(time) =>
              dispatch({ type: "setEllapsedTime", payload: time })
            }
          />
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
    </>
  );
};

export default MatchGame;
