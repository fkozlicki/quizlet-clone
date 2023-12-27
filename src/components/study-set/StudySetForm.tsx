import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useFieldArray, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import type {
  CreateStudySetValues,
  EditStudySetValues,
} from "../../schemas/study-set";
import {
  createStudySetSchema,
  editStudySetSchema,
} from "../../schemas/study-set";
import { api } from "../../utils/api";
import FlashcardDraggable from "./FlashcardDraggable";

interface StudySetFormProps {
  initialData?: EditStudySetValues;
}

const initialCards = Array.from({ length: 4 }, (_, index) => ({
  term: "",
  definition: "",
  position: index,
}));

const StudySetForm = ({ initialData }: StudySetFormProps) => {
  const { push } = useRouter();
  const { mutate: createSet, isLoading: createLoading } =
    api.studySet.create.useMutation({
      onSuccess: async ({ id }) => {
        await push(`/study-set/${id}`);
        void message.success("Created set successfully");
      },
      onError: () => {
        void message.error("Couldn't create set");
      },
    });
  const { mutate: editSet, isLoading: editLoading } =
    api.studySet.editById.useMutation({
      onSuccess: async ({ id }) => {
        await push(`/study-set/${id}`);
        void message.success("Edited set successfully");
      },
      onError: () => {
        void message.error("Couldn't edit set");
      },
    });
  const { handleSubmit, control, setValue } = useForm<
    CreateStudySetValues | EditStudySetValues
  >({
    resolver: zodResolver(
      initialData ? editStudySetSchema : createStudySetSchema
    ),
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
    <Form
      disabled={createLoading || editLoading}
      onFinish={handleSubmit(onFinish)}
      layout="vertical"
    >
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
            <FlashcardDraggable
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
        disabled={createLoading || editLoading}
        loading={createLoading || editLoading}
      >
        {initialData ? "Edit" : "Create"}
      </Button>
    </Form>
  );
};

export default StudySetForm;
