import { Typography, theme } from "antd";
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
  const {
    token: { colorBgContainer, green1, red1, green5, red5, colorBorder },
  } = theme.useToken();

  return (
    <div
      className="flex min-h-[30rem] flex-col rounded-md p-4 shadow-lg md:px-8 md:py-6"
      style={{
        background: colorBgContainer,
      }}
    >
      <div className="flex flex-1 flex-col sm:mb-12 sm:flex-row">
        <div className={`flex-1 pb-4`}>
          <Typography.Text
            className="mb-6 block font-semibold"
            type="secondary"
          >
            Term
          </Typography.Text>
          <Typography.Text className="text-2xl">{term}</Typography.Text>
        </div>
      </div>
      <div>
        {!result && (
          <Typography.Text className="mb-4 block">
            Choose answer
          </Typography.Text>
        )}
        {result && (
          <>
            {userAnswer === definition ? (
              <Typography.Text
                type="success"
                className="mb-2 inline-block text-base font-medium"
              >
                You&apos;ve got this
              </Typography.Text>
            ) : (
              <Typography.Text
                type="danger"
                className="mb-2 inline-block text-base font-medium"
              >
                You are still learning
              </Typography.Text>
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
                className={`rounded-md border-2 px-4 py-2 peer-checked:!border-blue-600 peer-checked:!bg-blue-600/10 ${
                  !result ? "cursor-pointer" : ""
                }`}
                style={{
                  background:
                    answer === definition
                      ? green1
                      : userAnswer === answer
                      ? red1
                      : "",
                  borderColor:
                    answer === definition
                      ? green5
                      : userAnswer === answer
                      ? red5
                      : colorBorder,
                }}
              >
                <Typography.Text>{answer}</Typography.Text>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoice;
