import { z } from "zod";

import type { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";
import { Form, FormField, useFieldArray, useForm } from "@acme/ui/form";

import type { Answer } from "./test-mode";
import MultipleChoiceCard from "../shared/multiple-choice-card";
import TrueFalseCard from "../shared/true-false-card";
import WrittenCard from "../shared/written-card";

const flashcard = z.object({
  id: z.number(),
  term: z.string(),
  definition: z.string(),
  studySetId: z.string(),
  userAnswer: z.string().min(1),
  position: z.number(),
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

const testSchema = z.object({
  trueOrFalse: z.array(trueOrFalse),
  multipleChoice: z.array(multipleChoice),
  written: z.array(flashcard),
});

interface TestFormProps {
  test: RouterOutputs["studySet"]["testCards"];
  onSubmit: (answer: Answer) => void;
}

const TestForm = ({ test, onSubmit }: TestFormProps) => {
  const initialData = Object.fromEntries(
    Object.entries(test).map((entry) => [
      entry[0],
      entry[1].map((question) => ({ ...question, userAnswer: "" })),
    ]),
  );
  const form = useForm({
    schema: testSchema,
    defaultValues: initialData,
  });
  const { fields: multipleChoice } = useFieldArray({
    control: form.control,
    name: "multipleChoice",
  });
  const { fields: trueOrFalse } = useFieldArray({
    control: form.control,
    name: "trueOrFalse",
  });
  const { fields: written } = useFieldArray({
    control: form.control,
    name: "written",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, console.log)}
        className="space-y-8"
      >
        {trueOrFalse.map(({ term, answer, id }, index) => (
          <FormField
            key={id}
            control={form.control}
            name={`trueOrFalse.${index}.userAnswer`}
            render={({ field }) => (
              <TrueFalseCard
                term={term}
                answer={answer}
                index={index}
                {...field}
              />
            )}
          />
        ))}
        {multipleChoice.map(({ term, id, answers }, index) => (
          <FormField
            key={id}
            control={form.control}
            name={`multipleChoice.${index}.userAnswer`}
            render={({ field }) => (
              <MultipleChoiceCard
                term={term}
                index={index}
                answers={answers}
                {...field}
              />
            )}
          />
        ))}
        {written.map(({ term, id }, index) => (
          <FormField
            key={id}
            control={form.control}
            name={`written.${index}.userAnswer`}
            render={({ field }) => (
              <WrittenCard key={id} term={term} {...field} />
            )}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default TestForm;
