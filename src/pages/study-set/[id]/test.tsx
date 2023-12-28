import { ReloadOutlined, RollbackOutlined } from "@ant-design/icons";
import type { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
import type { TestInputs } from "../../../components/test-mode/TestForm";
import TestForm from "../../../components/test-mode/TestForm";
import TestResult from "../../../components/test-mode/TestResult";
import { generateSSGHelper } from "../../../server/helpers/ssgHelper";
import { api } from "../../../utils/api";
import StudyModeResult from "../../../components/shared/StudyModeResult";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = generateSSGHelper();
  const setId = context.query?.id;

  if (typeof setId !== "string") {
    throw new Error("No setId");
  }

  await ssg.studySet.getTest.prefetch({ id: setId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      setId,
    },
  };
};

const Test = ({ setId }: { setId: string }) => {
  const { push } = useRouter();
  const { data: studySetTest, refetch } = api.studySet.getTest.useQuery(
    { id: setId },
    {
      refetchOnWindowFocus: false,
    }
  );
  const [result, setResult] = useState<TestInputs>();
  const [hard, setHard] = useState<number>();

  if (!studySetTest) {
    return <div>404</div>;
  }

  const cardCount = Object.values(studySetTest).flatMap((e) => e).length;

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

  const takeNewTest = () => {
    setResult(undefined);
    setHard(undefined);
    void refetch();
  };

  const backToStudySet = () => {
    void push(`/study-set/${setId}`);
  };

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Test" />
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
