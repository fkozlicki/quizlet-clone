import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import ProfileLayout from "../../components/layout/ProfileLayout";
import StudySetPreview from "../../components/StudySetPreview";
import { api } from "../../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const id = context.query.id as string;

  if (id !== session?.user?.id) {
    return {
      redirect: {
        destination: `/${id}/study-sets`,
        permanent: false,
      },
      props: {
        achivements: false,
      },
    };
  }

  return {
    props: {
      achivements: true,
    },
  };
};

interface StudySetsProps {
  achivements: boolean;
}

const StudySets = ({ achivements }: StudySetsProps) => {
  const { query, isReady } = useRouter();

  if (!isReady) return <div>Loading...</div>;

  const userId = query.id as string;

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
    <ProfileLayout achivements={achivements}>
      <div>
        {studySets.length > 0 ? (
          <div>
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
          <div className="">This user doesn&apos;t have any sets</div>
        )}
      </div>
    </ProfileLayout>
  );
};

export default StudySets;
