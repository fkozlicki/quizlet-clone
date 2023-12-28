import type { MouseEvent } from "react";
import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface MultipleChoiceProps {
  term: string;
  answers: string[];
  register?: UseFormRegisterReturn;
  index: number;
  result?: boolean;
  userAnswer?: string;
  definition?: string;
  type: "button" | "radio";
  callback?: (index: number, event: MouseEvent) => void;
}

const MultipleChoice = ({
  term,
  answers,
  register,
  index,
  result,
  userAnswer,
  definition,
  callback,
  type,
}: MultipleChoiceProps) => {
  return (
    <div className="flex min-h-[30rem] flex-col rounded-md bg-white p-4 shadow-lg md:px-8 md:py-6">
      <div className="flex flex-1 flex-col sm:mb-12 sm:flex-row">
        <div className={`flex-1 pb-4`}>
          <div className="mb-6">Term</div>
          <div>{term}</div>
        </div>
      </div>
      <div>
        {!result && <div className="mb-4">Choose answer</div>}
        {result && (
          <>
            {userAnswer === definition ? (
              <div className="mb-2 font-medium text-green-500">
                You&apos;ve got this
              </div>
            ) : (
              <div className="mb-2 font-medium text-red-500">
                You are still learning
              </div>
            )}
          </>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {answers.map((answer, answerIndex) => (
            <label
              key={answerIndex}
              htmlFor={`card-${index}-choice-${answerIndex}`}
            >
              <input
                {...register}
                type={type}
                value={answer}
                id={`card-${index}-choice-${answerIndex}`}
                className="peer hidden"
                disabled={!!result}
              />
              <div
                onClick={
                  callback ? (event) => callback(answerIndex, event) : undefined
                }
                className={`rounded-md border-2 px-4 py-2 peer-checked:border-blue-600 peer-checked:bg-blue-50 ${
                  result
                    ? answer === definition
                      ? "border-green-500 bg-green-50"
                      : ""
                    : userAnswer === answer
                    ? "border-red-500 bg-red-50"
                    : "cursor-pointer"
                }`}
              >
                {answer}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoice;
