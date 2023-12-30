import { Alert, Card, Divider, Typography, theme } from "antd";
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
  const {
    token: { colorBorder, red1, red5, green1, green5 },
  } = theme.useToken();

  return (
    <Card className="[&>div]:md:p-8">
      <div className="flex min-h-[30rem] flex-col">
        <div className="flex flex-1 flex-col sm:mb-12 sm:flex-row">
          <div
            className={`flex-1 border-b-2 pb-4 sm:border-b-0 sm:border-r-2 sm:pb-0 sm:pr-6`}
            style={{
              borderColor: colorBorder,
            }}
          >
            <Typography.Text
              className="mb-6 block font-semibold"
              type="secondary"
            >
              Term
            </Typography.Text>
            <Typography.Text className="text-xl">{term}</Typography.Text>
          </div>
          <div className="flex-1 pt-4 sm:pl-6 sm:pt-0">
            <Typography.Text
              className="mb-6 block font-semibold"
              type="secondary"
            >
              Definition
            </Typography.Text>
            <Typography.Text className="text-xl">{answer}</Typography.Text>
          </div>
        </div>
        <div>
          {!result && <div className="mb-4">Choose answer</div>}
          {result &&
            ((answer === definition && userAnswer === "true") ||
              (answer !== definition && userAnswer === "false")) && (
              <Typography.Text
                type="success"
                className="mb-2 inline-block text-base font-medium"
              >
                You&apos;ve got this
              </Typography.Text>
            )}
          {result &&
            ((answer === definition && userAnswer === "false") ||
              (answer !== definition && userAnswer === "true")) && (
              <Typography.Text
                type="danger"
                className="mb-2 inline-block text-base font-medium"
              >
                You are still learning
              </Typography.Text>
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
                className={`peer-checked:bg-blue-50" rounded-md border-2 px-4 py-2 text-center peer-checked:!border-blue-600 ${
                  !result ? "cursor-pointer" : ""
                }`}
                style={{
                  borderColor:
                    answer === definition
                      ? green5
                      : userAnswer === "true"
                      ? red5
                      : colorBorder,
                  background:
                    answer === definition
                      ? green1
                      : userAnswer === "true"
                      ? red1
                      : "",
                }}
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
                className={`rounded-md border-2 px-4 py-2 text-center peer-checked:!border-blue-600 ${
                  !result ? "cursor-pointer" : ""
                }`}
                style={{
                  borderColor:
                    answer !== definition
                      ? green5
                      : userAnswer === "false"
                      ? red5
                      : colorBorder,
                  background:
                    answer !== definition
                      ? green1
                      : userAnswer === "false"
                      ? red1
                      : "",
                }}
              >
                False
              </div>
            </label>
          </div>
          {result && definition !== answer && (
            <div className="mt-6 ">
              <Typography.Text
                type="secondary"
                className="mb-2 inline-block text-base font-medium"
              >
                Correct definition
              </Typography.Text>
              <Alert message={definition} type="success" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TrueOrFalse;
