import React, { useCallback } from "react";
import { type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import CreateCard from "../components/CreateCard";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import type { FieldArrayWithId } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

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

type CreateSetInputs = z.infer<typeof studySetSchema>;

const CreateSet = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSetInputs>({
    resolver: zodResolver(studySetSchema),
    defaultValues: {
      cards: [
        //creating 4 blank cards
        { term: "", definition: "" },
        { term: "", definition: "" },
        { term: "", definition: "" },
        { term: "", definition: "" },
      ],
    },
    mode: "onSubmit",
  });
  const { fields, remove, swap, append } = useFieldArray({
    control,
    name: "cards",
  });
  const createSet = api.studySet.create.useMutation({
    onSuccess: () => {
      toast("Created study set successfuly");
    },
    onError: () => {
      toast("Couldn't create study set");
    },
  });

  const appendCard = () => {
    append({
      definition: "",
      term: "",
    });
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    swap(dragIndex, hoverIndex);
  }, []);

  const renderCard = useCallback((card: FieldArrayWithId, index: number) => {
    const handleRemoveCard = () => {
      remove(index);
    };

    return (
      <CreateCard
        key={card.id}
        index={index}
        id={card.id}
        moveCard={moveCard}
        term={register(`cards.${index}.term`)}
        definition={register(`cards.${index}.definition`)}
        removeCallback={handleRemoveCard}
      />
    );
  }, []);

  const createStudySet = (data: CreateSetInputs) => {
    const convertedData = {
      ...data,
      cards: data.cards
        .filter((card) => card.term && card.definition)
        .map((card) => {
          const { term, definition } = card;
          if (!card.definition) return { term, definition: "..." };
          if (!card.term) return { term: "...", definition };
          return card;
        }),
    };

    createSet.mutate(convertedData);
    reset();
  };

  return (
    <div className="bg-slate-100">
      <form
        onSubmit={handleSubmit(createStudySet)}
        className="mx-4 max-w-[75rem] pb-4 sm:mx-10 xl:mx-auto"
      >
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
          {fields.map((field, index) => renderCard(field, index))}
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
    </div>
  );
};

export default CreateSet;
