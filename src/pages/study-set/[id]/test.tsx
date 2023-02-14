import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PieChart } from "react-minimal-pie-chart";
import { z } from "zod";
import MultipleChoice from "../../../components/cards/MultipleChoice";
import TrueOrFalse from "../../../components/cards/TrueOrFalse";
import Written from "../../../components/cards/Written";
import { api } from "../../../utils/api";

const flashcard = z.object({
  id: z.string(),
  term: z.string(),
  definition: z.string(),
  studySetId: z.string(),
  userAnswer: z.string().min(1),
});

const trueOrFalse = z
  .object({
    answer: z.string(),
  })
  .merge(flashcard);

const multipleChoice = z
  .object({
    answers: z.array(z.string()),
  })
  .merge(flashcard);

const testInputs = z.object({
  trueOrFalse: z.array(trueOrFalse),
  multipleChoice: z.array(multipleChoice),
  written: z.array(flashcard),
});

export type TestInputs = z.infer<typeof testInputs>;

const Test = () => {
  const { query } = useRouter();
  const setId = query.id?.toString();
  const { control, register, setValue, handleSubmit } = useForm<TestInputs>({
    // resolver: zodResolver(testInputs),
    defaultValues: {
      trueOrFalse: [],
      multipleChoice: [],
      written: [],
    },
  });
  const { fields: multipleChoice } = useFieldArray({
    control,
    name: "multipleChoice",
  });
  const { fields: trueOrFalse } = useFieldArray({
    control,
    name: "trueOrFalse",
  });
  const { fields: written } = useFieldArray({ control, name: "written" });
  api.studySet.getTest.useQuery(
    { id: setId! },
    {
      enabled: !!setId,
      refetchOnWindowFocus: false,
      onSuccess({ written, multipleChoice, trueOrFalse }) {
        setValue(
          "multipleChoice",
          multipleChoice.map((card) => ({ ...card, userAnswer: "" }))
        );
        setValue(
          "trueOrFalse",
          trueOrFalse.map((card) => ({ ...card, userAnswer: "" }))
        );
        setValue(
          "written",
          written.map((card) => ({ ...card, userAnswer: "" }))
        );
      },
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

  return (
    <div className="bg-slate-100">
      <div className="m-auto max-w-[55rem] p-4 sm:p-10">
        {result ? (
          <div>
            <div className="mb-6 text-3xl font-semibold">Your results</div>
            {correctness && (
              <div className="mb-10 flex">
                <PieChart
                  data={[{ value: correctness.correct, color: "#4ade80" }]}
                  totalValue={correctness.correct + correctness.incorrect}
                  lineWidth={25}
                  rounded
                  startAngle={270}
                  background="#fb923c"
                  label={({ dataEntry }) => (
                    <text
                      dominantBaseline="central"
                      x="50"
                      y="50"
                      dx="0"
                      dy="0"
                      color="red"
                      textAnchor="middle"
                      className="font-medium"
                    >
                      {dataEntry.percentage.toFixed(1)}%
                    </text>
                  )}
                  labelStyle={{
                    fontWeight: "500",
                    color: "#fff",
                  }}
                  labelPosition={0}
                  style={{
                    width: "96px",
                    height: "96px",
                  }}
                />
                <div className="flex gap-4">
                  <div className="flex flex-col justify-evenly">
                    <div className="text-xl font-medium text-green-600">
                      Know
                    </div>
                    <div className="text-xl font-medium text-orange-600">
                      Still learning
                    </div>
                  </div>
                  <div className="flex flex-col justify-evenly">
                    <div className="rounded-full border border-green-300 bg-green-100 px-4 text-xl font-medium text-green-600">
                      {correctness.correct}
                    </div>
                    <div className="rounded-full border border-orange-300 bg-orange-100 px-4 text-xl font-medium text-orange-600">
                      {correctness.incorrect}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 text-xl font-semibold">Your answers</div>
            <div className="flex flex-col gap-6">
              {result.trueOrFalse.map(
                ({ answer, term, userAnswer, definition }, index) => (
                  <TrueOrFalse
                    key={index}
                    term={term}
                    answer={answer}
                    index={index}
                    result
                    userAnswer={userAnswer}
                    definition={definition}
                  />
                )
              )}
              {result.multipleChoice.map(
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
              {result.written.map(({ term, userAnswer, definition }, index) => (
                <Written
                  key={index}
                  term={term}
                  index={index}
                  result
                  userAnswer={userAnswer}
                  definition={definition}
                />
              ))}
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(submitAnswers, (e) => console.log(e))}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-6">
              {trueOrFalse.map(({ answer, term }, index) => (
                <TrueOrFalse
                  key={index}
                  term={term}
                  answer={answer}
                  index={index}
                  register={register(`trueOrFalse.${index}.userAnswer`)}
                />
              ))}
              {multipleChoice.map(({ term, answers }, index) => (
                <MultipleChoice
                  key={index}
                  term={term}
                  answers={answers}
                  register={register(`multipleChoice.${index}.userAnswer`)}
                  index={index}
                  type="radio"
                />
              ))}
              {written.map(({ term }, index) => (
                <Written
                  key={index}
                  term={term}
                  register={register(`written.${index}.userAnswer`)}
                  index={index}
                />
              ))}
            </div>
            <button
              type="submit"
              className="rounded-md bg-blue-600 py-2 text-white"
            >
              Send anwers
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Test;
