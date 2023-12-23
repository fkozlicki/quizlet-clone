import { Button, Form, Input } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { api } from "../utils/api";
import CreateCard from "./CreateCard";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  CreateStudySetValues,
  EditStudySetValues,
} from "../schemas/study-set";
import { createStudySetSchema } from "../schemas/study-set";
import { FormItem } from "react-hook-form-antd";

interface StudySetFormProps {
  initialData?: EditStudySetValues;
}

const initialCards = Array.from({ length: 4 }, (_, index) => ({
  term: "",
  definition: "",
  position: index,
}));

const StudySetForm = ({ initialData }: StudySetFormProps) => {
  const { mutate: createSet } = api.studySet.create.useMutation();
  const { mutate: editSet } = api.studySet.editById.useMutation();
  const { handleSubmit, control, setValue } = useForm<
    CreateStudySetValues | EditStudySetValues
  >({
    resolver: zodResolver(createStudySetSchema),
    defaultValues: initialData ?? {
      cards: initialCards,
    },
  });
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "cards",
  });

  const onFinish = (values: CreateStudySetValues | EditStudySetValues) => {
    const convertedData = {
      ...values,
      cards: values.cards
        .filter((card) => card.term && card.definition)
        .map((card) => {
          const { term, definition, position } = card;
          if (!card.definition) return { term, definition: "...", position };
          if (!card.term) return { term: "...", definition, position };
          return card;
        }),
    };

    if ("id" in convertedData) {
      editSet(convertedData);
    } else {
      createSet(convertedData);
    }
  };

  const swapCards = (from: number, to: number) => {
    setValue(`cards.${from}.position`, to);
    setValue(`cards.${to}.position`, from);
    swap(from, to);
  };

  return (
    <Form onFinish={handleSubmit(onFinish)} layout="vertical">
      <FormItem control={control} name="title" label="Title">
        <Input size="large" />
      </FormItem>
      <FormItem control={control} label="Description" name="description">
        <Input.TextArea size="large" />
      </FormItem>
      <div className="pb-2">Flashcards</div>
      <DndProvider backend={HTML5Backend}>
        <div className="mb-6 flex flex-col gap-6">
          {fields.map((field, index) => (
            <CreateCard
              key={field.id}
              id={field.id}
              control={control}
              index={index}
              remove={remove}
              swap={swapCards}
              cardsCount={fields.length}
            />
          ))}
        </div>
      </DndProvider>
      <Button
        onClick={() =>
          append({ term: "", definition: "", position: fields.length })
        }
        className="mb-6 h-16 w-full"
      >
        Add Card
      </Button>
      <Button
        htmlType="submit"
        size="large"
        type="primary"
        className="ml-auto block h-14 w-28"
      >
        {initialData ? "Edit" : "Create"}
      </Button>
    </Form>
  );
};

export default StudySetForm;
