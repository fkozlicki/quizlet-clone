import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import type { StudySetTest } from "../../../server/api/routers/study-set";
import MultipleChoice from "../../cards/MultipleChoice";
import TrueOrFalse from "../../cards/TrueOrFalse";
import Written from "../../cards/Written";
import { Button } from "antd";

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

interface TestFormProps {
  studySetTest: StudySetTest;
  formCallack: (data: TestInputs) => void;
}

const TestForm = ({ studySetTest, formCallack }: TestFormProps) => {
  const initialData = Object.fromEntries(
    Object.entries(studySetTest).map((entry) => [
      entry[0],
      entry[1].map((question) => ({ ...question, userAnswer: "" })),
    ])
  );

  const { control, register, handleSubmit } = useForm<TestInputs>({
    // resolver: zodResolver(testInputs),
    defaultValues: initialData,
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

  return (
    <form onSubmit={handleSubmit(formCallack)} className="flex flex-col gap-6">
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
      <Button htmlType="submit" className="h-12" type="primary" size="large">
        Send anwers
      </Button>
    </form>
  );
};

export default TestForm;
