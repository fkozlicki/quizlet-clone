import React from "react";
import type { NextPage } from "next";
import { type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { api } from "../../../utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import type { CreateSetInputs } from "../../../components/StudySetForm";
import StudySetForm from "../../../components/StudySetForm";

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

const Edit: NextPage = () => {
  const { query } = useRouter();
  const { data: studySet, isLoading } = api.studySet.getById.useQuery(
    { id: query.id as string },
    {
      enabled: !!query.id,
      refetchOnWindowFocus: false,
    }
  );
  const updateSet = api.studySet.editById.useMutation({
    onSuccess: () => {
      toast("Editted study set successfuly", {
        icon: "✅",
      });
    },
    onError: () => {
      toast("Couldn't create study set", {
        icon: "❌",
      });
    },
  });

  const updateStudySet = (data: CreateSetInputs) => {
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

    updateSet.mutate({
      id: query.id as string,
      body: {
        title: convertedData.title,
        description: convertedData.description,
        cards: convertedData.cards,
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-slate-100">
      <div className="mx-4 max-w-[75rem] pb-4 sm:mx-10 xl:mx-auto">
        {studySet && (
          <StudySetForm formCallback={updateStudySet} initialData={studySet} />
        )}
      </div>
    </div>
  );
};

export default Edit;
