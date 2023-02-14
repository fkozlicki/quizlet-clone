import React, { useRef } from "react";
import { type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import type { CreateSetInputs } from "../components/StudySetForm";
import StudySetForm from "../components/StudySetForm";

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

const CreateSet = () => {
  const resetRef = useRef<(() => void) | null>(null);
  const createSet = api.studySet.create.useMutation({
    onSuccess: () => {
      toast("Created study set successfuly");
    },
    onError: () => {
      toast("Couldn't create study set");
    },
  });
  const initialData = {
    title: "",
    description: "",
    cards: [
      { term: "", definition: "" },
      { term: "", definition: "" },
      { term: "", definition: "" },
      { term: "", definition: "" },
    ],
  };

  const createStudySet = (data: CreateSetInputs) => {
    const { current: reset } = resetRef;
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
    reset && reset();
  };

  return (
    <div className="bg-slate-100">
      <div className="mx-4 max-w-[75rem] pb-4 sm:mx-10 xl:mx-auto">
        <StudySetForm
          formCallback={createStudySet}
          initialData={initialData}
          resetRef={resetRef}
        />
      </div>
    </div>
  );
};

export default CreateSet;
