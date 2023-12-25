import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import StudySetPreview from "../../components/StudySetPreview";
import ProfileLayout from "../../components/layout/ProfileLayout";
import { api } from "../../utils/api";
import type { NextPageWithLayout } from "../_app";

const StudySets: NextPageWithLayout = () => {
  const { query, isReady } = useRouter();
  const { data: session } = useSession();

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
    <>
      <NextSeo title="Quizlet 2.0 - Study sets" />
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
                authorId={set.userId}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {session ? (
            <div>You have not sets</div>
          ) : (
            <div className="">This user doesn&apos;t have any sets</div>
          )}
        </>
      )}
    </>
  );
};

StudySets.getLayout = (page) => {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default StudySets;
