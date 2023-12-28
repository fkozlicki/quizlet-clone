import { Button } from "antd";
import type { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useEffect, useReducer } from "react";
import EndScreen from "../../../components/match-mode/EndScreen";
import MemoryCard from "../../../components/match-mode/MemoryCard";
import StartScreen from "../../../components/match-mode/StartScreen";
import { generateSSGHelper } from "../../../server/helpers/ssgHelper";
import { api } from "../../../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = generateSSGHelper();
  const setId = context.query?.id;

  if (typeof setId !== "string") {
    throw new Error("No setId");
  }

  await ssg.studySet.getRandomCards.prefetch({ id: setId, count: 3 });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      setId,
    },
  };
};

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

const Match = ({ setId }: { setId: string }) => {
  const [
    { cards, matched, mismatch, selected, stage, ellapsedTime },
    dispatch,
  ] = useReducer(gameReducer, initialGameState);
  const { refetch } = api.studySet.getRandomCards.useQuery(
    { id: setId, count: 3 },
    {
      refetchOnWindowFocus: false,
      onSuccess(data) {
        const shuffeledCards = data
          .reduce((acc, card) => {
            const termCard = {
              flashcardId: card.id,
              content: card.term,
            };
            const definitionCard = {
              flashcardId: card.id,
              content: card.definition,
            };
            acc.push(termCard, definitionCard);
            return acc;
          }, [] as GameCard[])
          .sort(() => 0.5 - Math.random());
        dispatch({ type: "setCards", payload: shuffeledCards });
      },
    }
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
    await refetch();
    dispatch({ type: "clear" });
    dispatch({ type: "setStage", payload: "start" });
  };

  if (!cards) {
    return <div>404</div>;
  }

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Match" />
      <div className="mb-5 flex justify-end">
        <Link
          href={`/study-set/${setId}`}
          className="rounded-md px-4 py-2 font-medium hover:bg-slate-100"
        >
          <Button type="text" size="large">
            Back to set
          </Button>
        </Link>
      </div>
      {stage === "initial" && <StartScreen startGame={startGame} />}
      {stage === "start" && (
        <>
          <div className="mb-4 text-xl">{ellapsedTime.toFixed(1)} sec.</div>
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
    </>
  );
};

export default Match;
