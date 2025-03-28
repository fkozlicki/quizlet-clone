"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RotateCcw, Undo2 } from "lucide-react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import GameResult from "../shared/game-result";
import TestAnswer from "./test-answer";
import TestForm from "./test-form";

type Test = RouterOutputs["studySet"]["testCards"];

type MultipleChoice = Test["multipleChoice"][number] & { userAnswer: string };
type Written = Test["written"][number] & { userAnswer: string };
type TrueFalse = Test["trueOrFalse"][number] & { userAnswer: string };

export interface Answers {
  multipleChoice: MultipleChoice[];
  written: Written[];
  trueOrFalse: TrueFalse[];
}

const TestMode = () => {
  const { id }: { id: string } = useParams();
  const [test] = api.studySet.testCards.useSuspenseQuery({ id });
  const router = useRouter();
  const [answer, setAnswer] = useState<Answers | undefined>();
  const [hard, setHard] = useState<number>(0);

  const cardCount = Object.values(test).flatMap((e) => e).length;

  const onSubmit = (answer: Answers) => {
    setAnswer(answer);
    setHard(calculateHard(answer));
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  };

  const calculateHard = (answer: Answers) => {
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
    router.push(`/study-sets/${id}`);
  };

  if (answer) {
    return (
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
    );
  }

  return <TestForm test={test} onSubmit={onSubmit} />;
};

export default TestMode;
