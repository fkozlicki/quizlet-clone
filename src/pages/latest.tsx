import type { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
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
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") return <div>Loading...</div>;

  const userId = session.user.id;

  const {
    data: studySets,
    isLoading,
    error,
  } = api.studySet.getUserSets.useQuery({
    id: userId,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Latest" />
      <div className="min-h-screen bg-slate-100 py-5 sm:py-10">
        <div className="mx-4 max-w-[75rem] sm:mx-6 xl:m-auto">
          {studySets.length > 0 ? (
            <div>
              <h1 className="mb-8 text-lg font-medium">Your study sets</h1>
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
            <div className="flex flex-col items-center">
              <h1 className="mb-4 text-lg font-medium">
                You have no study sets
              </h1>
              <Link
                href="/create-set"
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                Create one
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Latest;
