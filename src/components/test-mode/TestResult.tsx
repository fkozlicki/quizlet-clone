import React from "react";
import MultipleChoice from "../shared/MultipleChoice";
import TrueOrFalse from "./TrueOrFalse";
import Written from "./WrittenAnswer";
import type { TestInputs } from "./TestForm";

interface TestResultProps {
  result: TestInputs;
}

const TestResult = ({ result }: TestResultProps) => {
  const { trueOrFalse, multipleChoice, written } = result;

  return (
    <>
      <div className="mb-6 text-xl font-semibold">Your answers</div>
      <div className="flex flex-col gap-6">
        {trueOrFalse.map(({ answer, term, userAnswer, definition }, index) => (
          <TrueOrFalse
            key={index}
            term={term}
            answer={answer}
            index={index}
            result
            userAnswer={userAnswer}
            definition={definition}
          />
        ))}
        {multipleChoice.map(
          ({ term, answers, userAnswer, definition }, index) => (
            <MultipleChoice
              key={index}
              term={term}
              answers={answers}
              index={index}
              result
              userAnswer={userAnswer}
              definition={definition}
              type="radio"
            />
          )
        )}
        {written.map(({ term, userAnswer, definition }, index) => (
          <Written
            key={index}
            term={term}
            result
            userAnswer={userAnswer}
            definition={definition}
          />
        ))}
      </div>
    </>
  );
};

export default TestResult;
