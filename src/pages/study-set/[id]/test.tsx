import { ReloadOutlined, RollbackOutlined } from "@ant-design/icons";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
import Result from "../../../components/Result";
import type { TestInputs } from "../../../components/pages/test/TestForm";
import TestForm from "../../../components/pages/test/TestForm";
import UserAnswers from "../../../components/pages/test/UserAnswers";
import { api } from "../../../utils/api";

const Test = () => {
  const { query, push } = useRouter();
  const { id: setId } = query as { id?: string };
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
  const [hard, setHard] = useState<number>();

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
        0
      ) +
      written.reduce(
        (acc, { userAnswer, definition }) =>
          userAnswer !== definition ? acc + 1 : acc,
        0
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

  const takeNewTest = async () => {
    setResult(undefined);
    setHard(undefined);
    await refetch();
  };

  if (isLoading || !setId) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  const backToStudySet = async () => {
    await push(`/study-set/${setId}`);
  };

  const cardCount = Object.values(studySetTest).flatMap((e) => e).length;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Test" />
      <div className="m-auto max-w-3xl">
        {result && hard ? (
          <>
            <Result
              hard={hard}
              cardCount={cardCount}
              firstButton={{
                text: "Take a new test",
                description: "Take a new test with another questions.",
                Icon: <ReloadOutlined />,
                callback: takeNewTest,
              }}
              secondButton={{
                text: "Back to study set",
                description: "Back to study set",
                Icon: <RollbackOutlined />,
                callback: backToStudySet,
              }}
            />
            <UserAnswers result={result} />
          </>
        ) : (
          <>
            {studySetTest && (
              <TestForm
                studySetTest={studySetTest}
                formCallack={submitAnswers}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Test;
