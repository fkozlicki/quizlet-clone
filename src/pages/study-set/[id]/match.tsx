import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import MemoryCard from "../../../components/MemoryCard";
import { api } from "../../../utils/api";

interface GameCard {
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

const Match = () => {
  const { query } = useRouter();
  const id = query.id?.toString();
  const [
    { cards, matched, mismatch, selected, stage, ellapsedTime },
    dispatch,
  ] = useReducer(gameReducer, initialGameState);
  const { refetch } = api.studySet.getRandomCards.useQuery(
    { id: id!, count: 3 },
    {
      enabled: !!id,
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
  }, [matched]);

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
  }, [selected]);

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (stage === "start") {
      interval = setInterval(() => {
        dispatch({ type: "startTimer" });
      }, 100);
    }
    if (stage === "finished" && interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [stage]);

  const checkIsSelected = (index: number) => {
    return selected.includes(index);
  };

  const checkIsMatched = (index: number) => {
    return matched.includes(index);
  };

  const checkIsMisatch = (index: number) => {
    return mismatch.includes(index);
  };

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

  return (
    <div className="m-auto max-w-[55rem] p-4 sm:p-10">
      <div className="mb-5 flex justify-end">
        <Link
          href={`/study-set/${id!}`}
          className="rounded-md py-2 px-4 font-medium hover:bg-slate-100"
        >
          Back to set
        </Link>
      </div>
      {stage === "initial" && (
        <div>
          <h1 className="mb-2 text-center text-2xl font-semibold">
            Are you ready?
          </h1>
          <p className="mb-5 text-center text-lg">
            Match all terms with definitions
          </p>
          <button
            onClick={startGame}
            className="m-auto block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Start game
          </button>
        </div>
      )}
      {stage === "start" && (
        <div>
          <div className="mb-4 text-xl">{ellapsedTime.toFixed(1)} sec.</div>
          <div className="grid h-full grid-cols-3 gap-4">
            {cards &&
              cards.map((card, index) => (
                <MemoryCard
                  key={index}
                  content={card.content}
                  selectCallback={() => selectCard(index)}
                  isSelected={checkIsSelected(index)}
                  isMatched={checkIsMatched(index)}
                  isMismatch={checkIsMisatch(index)}
                />
              ))}
          </div>
        </div>
      )}
      {stage === "finished" && (
        <div className="flex flex-col items-center">
          <div className="text-lg">You finished in</div>
          <div className="mb-4 text-2xl font-bold">
            {ellapsedTime.toFixed(1)} sec.
          </div>
          {/* IF RECORD => RECORD */}
          {/* <div className="text-lg">Your best score is {}</div> */}
          <button
            onClick={playAgain}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
};

export default Match;
