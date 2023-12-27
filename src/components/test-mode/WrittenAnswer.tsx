import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface WrittenAnswerProps {
  term: string;
  register?: UseFormRegisterReturn;
  index: number;
  result?: boolean;
  definition?: string;
  userAnswer?: string;
}

const WrittenAnswer = ({
  term,
  register,
  index,
  result,
  definition,
  userAnswer,
}: WrittenAnswerProps) => {
  return (
    <div className="flex min-h-[30rem] flex-col rounded-md bg-white p-4 shadow-lg md:px-8 md:py-6">
      <div className="flex flex-1 flex-col sm:mb-12 sm:flex-row">
        <div className={`flex-1 pb-4`}>
          <div className="mb-6">Term</div>
          <div>{term}</div>
        </div>
      </div>
      <div>
        {!result && (
          <label
            htmlFor={`card-${index}-answer`}
            className="flex flex-col gap-4"
          >
            <span>Your answer</span>
            <input
              {...register}
              id={`card-${index}-answer`}
              type="text"
              placeholder="Type the answer"
              className="rounded-md bg-slate-200 px-4 py-2 outline-none"
            />
          </label>
        )}
        {result && (
          <>
            {userAnswer !== definition ? (
              <>
                <p className="mb-2 font-medium text-red-500/90">
                  You are still learning
                </p>
                <div className="mb-6 rounded-md border-2 border-red-500 bg-red-50 p-4">
                  {userAnswer}
                </div>
                <p className="mb-2 font-medium text-gray-500">Correct answer</p>
              </>
            ) : (
              <p className="mb-2 font-medium text-green-500">
                You&apos;ve got this
              </p>
            )}
            <div className="rounded-md border-2 border-green-500 bg-green-50 p-4">
              {definition}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WrittenAnswer;
