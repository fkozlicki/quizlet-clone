import { Button, Empty } from "antd";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import StudySetPreview from "../../components/StudySetPreview";
import StudySetSkeleton from "../../components/StudySetSkeleton";
import ProfileLayout from "../../components/layout/ProfileLayout";
import { api } from "../../utils/api";
import type { NextPageWithLayout } from "../_app";

const StudySets: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { id: userId } = query as { id?: string };
  const {
    data: studySets,
    isLoading,
    isError,
    refetch,
  } = api.studySet.getUserSets.useQuery(
    {
      id: userId!,
    },
    {
      enabled: !!userId,
    }
  );

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <StudySetSkeleton />
        <StudySetSkeleton />
        <StudySetSkeleton />
        <StudySetSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg">Failed to load data</div>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Study sets" />
      {studySets.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {studySets.map((set) => (
            <StudySetPreview
              key={set.id}
              authorImage={set.user.image}
              authorName={set.user.name}
              title={set.title}
              termsCount={set.cards.length}
              id={set.id}
              authorId={set.user.id}
            />
          ))}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Link href="/create-set">
            <Button type="primary">Create Now</Button>
          </Link>
        </Empty>
      )}
    </>
  );
};

StudySets.getLayout = (page) => {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default StudySets;
