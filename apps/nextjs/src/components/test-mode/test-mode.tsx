"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RotateCcw, Undo2 } from "lucide-react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import GameResult from "../shared/game-result";
import TestAnswer from "./test-answer";
import TestForm from "./test-form";

type Test = RouterOutputs["studySet"]["testCards"];
export interface Answer {
  multipleChoice: (Test["multipleChoice"][0] & { userAnswer: string })[];
  written: (Test["written"][0] & { userAnswer: string })[];
  trueOrFalse: (Test["trueOrFalse"][0] & { userAnswer: string })[];
}

const TestMode = () => {
  const { id }: { id: string } = useParams();
  const { data: test } = api.studySet.testCards.useQuery({ id });
  const router = useRouter();
  const [answer, setAnswer] = useState<Answer | undefined>();
  const [hard, setHard] = useState<number>(0);

  const cardCount = Object.values(test!).flatMap((e) => e).length;

  const onSubmit = (answer: Answer) => {
    setAnswer(answer);
    setHard(calculateHard(answer));
    window && window.scrollTo(0, 0);
  };

  const calculateHard = (answer: Answer) => {
    const { multipleChoice, written, trueOrFalse } = answer;
    const hard =
      multipleChoice.reduce(
        (acc, { userAnswer, definition }) =>
          userAnswer !== definition ? acc + 1 : acc,
        0,
      ) +
      written.reduce(
        (acc, { userAnswer, definition }) =>
          userAnswer !== definition ? acc + 1 : acc,
        0,
      ) +
      trueOrFalse.reduce((acc, { answer, definition, userAnswer }) => {
        if (
          (answer === definition && userAnswer === "false") ||
          (answer !== definition && userAnswer === "true")
        )
          return acc + 1;
        return acc;
      }, 0);

    return hard;
  };

  const takeNewTest = () => {
    setAnswer(undefined);
    setHard(0);
  };

  const backToStudySet = () => {
    router.push(`/study-set/${id}`);
  };

  return (
    <>
      {answer && hard !== undefined ? (
        <>
          <GameResult
            hard={hard}
            cardCount={cardCount}
            firstButton={{
              text: "Take a new test",
              description: "Take a new test with another questions.",
              Icon: <RotateCcw />,
              callback: takeNewTest,
            }}
            secondButton={{
              text: "Back to study set",
              description: "Back to study set",
              Icon: <Undo2 />,
              callback: backToStudySet,
            }}
          />
          <TestAnswer answer={answer} />
        </>
      ) : (
        <TestForm test={test!} onSubmit={onSubmit} />
      )}
    </>
  );
};

export default TestMode;
