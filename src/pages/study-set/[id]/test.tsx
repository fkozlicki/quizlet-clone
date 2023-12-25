import { ArrowPathIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useState } from "react";
import type { TestInputs } from "../../../components/pages/test/TestForm";
import TestForm from "../../../components/pages/test/TestForm";
import UserAnswers from "../../../components/pages/test/UserAnswers";
import Result from "../../../components/Result";
import { api } from "../../../utils/api";

const Test = () => {
  const { query, push } = useRouter();
  const setId = query.id?.toString();
  const {
    data: studySetTest,
    isLoading,
    error,
    refetch,
  } = api.studySet.getTest.useQuery(
    { id: setId! },
    {
      enabled: !!setId,
      refetchOnWindowFocus: false,
    }
  );
  const [result, setResult] = useState<TestInputs>();
  const [correctness, setCorrectness] = useState<{
    correct: number;
    incorrect: number;
  }>();

  const submitAnswers = (data: TestInputs) => {
    setResult({ ...data });

    // correctness
    const correct = calculateCorrectness(data);
    const incorrect =
      Object.values(data).reduce((acc, el) => acc + el.length, 0) - correct;
    setCorrectness({ correct, incorrect });
    window && window.scrollTo(0, 0);
  };

  const calculateCorrectness = (answers: TestInputs) => {
    const { multipleChoice, written, trueOrFalse } = answers;
    const correctiness =
      multipleChoice.reduce(
        (acc, { userAnswer, definition }) =>
          userAnswer === definition ? acc + 1 : acc,
        0
      ) +
      written.reduce(
        (acc, { userAnswer, definition }) =>
          userAnswer === definition ? acc + 1 : acc,
        0
      ) +
      trueOrFalse.reduce((acc, { answer, definition, userAnswer }) => {
        if (
          (answer === definition && userAnswer === "true") ||
          (answer !== definition && userAnswer === "false")
        )
          return acc + 1;
        return acc;
      }, 0);

    return correctiness;
  };

  const takeNewTest = async () => {
    await refetch();
    setResult(undefined);
    setCorrectness(undefined);
  };

  if (isLoading || !setId) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  const backToStudySet = async () => {
    await push(`/study-set/${setId}`);
  };

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Test" />
      {result && correctness ? (
        <div>
          <Result
            know={correctness.correct}
            learning={correctness.incorrect}
            firstButton={{
              text: "Take a new test",
              Icon: ArrowPathIcon,
              callback: takeNewTest,
            }}
            secondButton={{
              text: "Back to study set",
              Icon: ArrowUturnLeftIcon,
              callback: backToStudySet,
            }}
          />
          <UserAnswers result={result} />
        </div>
      ) : (
        <>
          {studySetTest && (
            <TestForm studySetTest={studySetTest} formCallack={submitAnswers} />
          )}
        </>
      )}
    </>
  );
};

export default Test;
