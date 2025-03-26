import React from "react";

import type { Answers } from "./test-mode";
import MultipleChoiceCard from "../shared/multiple-choice-card";
import TrueFalseCard from "../shared/true-false-card";
import WrittenCard from "../shared/written-card";

interface TestAnswerProps {
  answer: Answers;
}

const TestAnswer = ({ answer }: TestAnswerProps) => {
  const { trueOrFalse, multipleChoice, written } = answer;

  return (
    <>
      <span className="mb-6 text-xl font-semibold">Your answers</span>
      <div className="flex flex-col gap-6">
        {trueOrFalse.map(({ answer, term, userAnswer, definition }, index) => (
          <TrueFalseCard
            key={index}
            index={index}
            term={term}
            answer={answer}
            definition={definition}
            userAnswer={userAnswer}
          />
        ))}
        {multipleChoice.map(
          ({ term, answers, userAnswer, definition }, index) => (
            <MultipleChoiceCard
              key={index}
              index={index}
              term={term}
              answers={answers}
              definition={definition}
              userAnswer={userAnswer}
            />
          ),
        )}
        {written.map(({ term, userAnswer, definition }, index) => (
          <WrittenCard
            key={index}
            term={term}
            userAnswer={userAnswer}
            definition={definition}
          />
        ))}
      </div>
    </>
  );
};

export default TestAnswer;
