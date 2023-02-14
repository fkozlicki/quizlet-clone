import { zodResolver } from "@hookform/resolvers/zod";
import type { MutableRefObject } from "react";
import { useEffect } from "react";
import React, { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import CreateCard from "./CreateCard";

const studySetSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  cards: z
    .array(
      z.object({
        term: z.string(),
        definition: z.string(),
      })
    )
    .refine((data) => {
      let count = 0;
      data.forEach((el) => {
        if (el.term.length > 0 && el.definition.length > 0) ++count;
      });
      return count >= 2;
    }, "You need two cards to create a set."),
});

export type CreateSetInputs = z.infer<typeof studySetSchema>;

interface StudySetFormProps {
  formCallback: (data: CreateSetInputs) => void;
  initialData: CreateSetInputs;
  resetRef?: MutableRefObject<(() => void) | null>;
}

const StudySetForm = ({
  formCallback,
  initialData,
  resetRef,
}: StudySetFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSetInputs>({
    resolver: zodResolver(studySetSchema),
    defaultValues: initialData,
    mode: "onSubmit",
  });
  const { fields, remove, swap, append } = useFieldArray({
    control,
    name: "cards",
  });

  useEffect(() => {
    if (resetRef) {
      resetRef.current = reset;
    }
  }, []);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    swap(dragIndex, hoverIndex);
  }, []);

  const appendCard = () => {
    append({
      definition: "",
      term: "",
    });
  };

  return (
    <form onSubmit={handleSubmit(formCallback)}>
      <div className="mb-8">
        <h1 className="py-4 text-lg font-semibold">Create new study set</h1>
        <button className="hidden">Create</button>
      </div>
      <input
        className="mb-6 w-full rounded-lg bg-white px-4 py-2 text-lg outline-none placeholder:text-lg placeholder:font-semibold placeholder:text-gray-500"
        type="text"
        placeholder="Enter title"
        {...register("title")}
      />
      <textarea
        className="mb-6 h-[120px] w-full resize-none rounded-lg bg-white px-4 py-2 text-lg outline-none placeholder:text-base placeholder:font-semibold placeholder:text-gray-500"
        placeholder="Add a description..."
        {...register("description")}
      />
      {errors.cards && <p>{errors.cards.message}</p>}
      <DndProvider backend={HTML5Backend}>
        {fields.map((field, index) => (
          <CreateCard
            key={field.id}
            index={index}
            id={field.id}
            moveCard={moveCard}
            term={register(`cards.${index}.term`)}
            definition={register(`cards.${index}.definition`)}
            removeCallback={() => remove(index)}
          />
        ))}
      </DndProvider>
      <button
        type="button"
        onClick={appendCard}
        className="group mb-8 flex w-full justify-center rounded-md bg-white p-4 shadow md:py-8"
      >
        <p className="border-b-4 border-cyan-400 pb-2 font-semibold uppercase group-hover:border-yellow-500 group-hover:text-yellow-500">
          + add card
        </p>
      </button>
      <button
        type="submit"
        className="ml-auto block rounded-lg bg-blue-600 px-8 py-5 text-white hover:bg-blue-700"
      >
        Create
      </button>
    </form>
  );
};

export default StudySetForm;
