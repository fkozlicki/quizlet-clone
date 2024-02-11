"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StudyModeResult from "./shared/StudyModeResult";
import TestForm, { type TestInputs } from "./test-mode/TestForm";
import TestResult from "./test-mode/TestResult";
import { type StudySetTest } from "@/server/api/routers/study-set";
import { ReloadOutlined, RollbackOutlined } from "@ant-design/icons";

const TestGame = ({ test, setId }: { test: StudySetTest; setId: string }) => {
  const router = useRouter();
  const [result, setResult] = useState<TestInputs>();
  const [hard, setHard] = useState<number>();

  const cardCount = Object.values(test).flatMap((e) => e).length;

  const submitAnswers = (data: TestInputs) => {
    setResult(data);
    setHard(calculateHard(data));
    window && window.scrollTo(0, 0);
  };

  const calculateHard = (answers: TestInputs) => {
    const { multipleChoice, written, trueOrFalse } = answers;
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
    setResult(undefined);
    setHard(undefined);
  };

  const backToStudySet = () => {
    router.push(`/study-set/${setId}`);
  };

  return (
    <div className="m-auto max-w-3xl">
      {result && hard !== undefined ? (
        <>
          <StudyModeResult
            hard={hard}
            cardCount={cardCount}
            firstButton={{
              text: "Take a new test",
              description: "Take a new test with another questions.",
              Icon: <ReloadOutlined className="text-3xl" />,
              callback: takeNewTest,
            }}
            secondButton={{
              text: "Back to study set",
              description: "Back to study set",
              Icon: <RollbackOutlined className="text-3xl" />,
              callback: backToStudySet,
            }}
          />
          <TestResult result={result} />
        </>
      ) : (
        <TestForm studySetTest={test} formCallack={submitAnswers} />
      )}
    </div>
  );
};

export default TestGame;
