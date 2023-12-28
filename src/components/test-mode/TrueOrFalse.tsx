import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface TrueOrFalseProps {
  term: string;
  answer: string;
  register?: UseFormRegisterReturn;
  index: number;
  result?: boolean;
  userAnswer?: string;
  definition?: string;
}

const TrueOrFalse = ({
  term,
  answer,
  register,
  index,
  result,
  userAnswer,
  definition,
}: TrueOrFalseProps) => {
  return (
    <div className="flex min-h-[30rem] flex-col rounded-md bg-white p-4 shadow-lg md:px-8 md:py-6">
      <div className="flex flex-1 flex-col sm:mb-12 sm:flex-row">
        <div
          className={`flex-1 border-b-2 pb-4 sm:border-b-0 sm:border-r-2 sm:pb-0 sm:pr-4`}
        >
          <div className="mb-6">Term</div>
          <div>{term}</div>
        </div>
        <div className="flex-1 pt-4 sm:pl-4 sm:pt-0">
          <div className="mb-6">Definition</div>
          <div>{answer}</div>
        </div>
      </div>
      <div>
        {!result && <div className="mb-4">Choose answer</div>}
        {result &&
          ((answer === definition && userAnswer === "true") ||
            (answer !== definition && userAnswer === "false")) && (
            <div className="mb-2 font-medium text-green-500">
              You&apos;ve got this
            </div>
          )}
        {result &&
          ((answer === definition && userAnswer === "false") ||
            (answer !== definition && userAnswer === "true")) && (
            <div className="mb-2 font-medium text-red-500">
              You are still learning
            </div>
          )}
        <div className="flex gap-4">
          <label
            htmlFor={`${result ? "result-card" : "card"}-${index}-true`}
            className="flex-1"
          >
            <input
              {...register}
              type="radio"
              className="peer hidden"
              id={`${result ? "result-card" : "card"}-${index}-true`}
              value={"true"}
              disabled={!!result}
            />
            <div
              className={`peer-checked:bg-blue-50" rounded-md border-2 px-4 py-2 text-center peer-checked:border-blue-600 ${
                result
                  ? answer === definition
                    ? "border-green-500 bg-green-50"
                    : userAnswer === "true"
                    ? "border-red-500 bg-red-50"
                    : ""
                  : "cursor-pointer"
              }`}
            >
              True
            </div>
          </label>
          <label htmlFor={`card-${index}-false`} className="flex-1">
            <input
              {...register}
              type="radio"
              className="peer hidden"
              value="false"
              id={`card-${index}-false`}
              disabled={!!result}
            />
            <div
              className={`rounded-md border-2 px-4 py-2 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 ${
                result
                  ? answer !== definition
                    ? "border-green-500 bg-green-50"
                    : userAnswer === "false"
                    ? "border-red-500 bg-red-50"
                    : ""
                  : "cursor-pointer"
              }`}
            >
              False
            </div>
          </label>
        </div>
        {result && definition !== answer && (
          <div className="mt-6 ">
            <p className="mb-2 font-medium text-gray-600">Correct definition</p>
            <div className="rounded-md border-2 border-green-500 bg-green-50 p-4">
              {definition}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrueOrFalse;
