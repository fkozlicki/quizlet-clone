import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import StudySetPreview from "../components/StudySetPreview";
import { api } from "../utils/api";

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

const Latest = () => {
  const { data: studySets } = api.studySet.getUserSets.useQuery();

  return (
    <div className="bg-slate-100 py-5 sm:py-10">
      <div className="mx-4 max-w-[75rem] sm:mx-6 xl:m-auto">
        {studySets ? (
          <div>
            <p>Recent</p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {studySets.map((set) => (
                <StudySetPreview
                  key={set.id}
                  authorImage={set.user.image}
                  authorName={set.user.name}
                  title={set.title}
                  termsCount={set.cards.length}
                  id={set.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>You have no study sets</div>
        )}
      </div>
    </div>
  );
};

export default Latest;
