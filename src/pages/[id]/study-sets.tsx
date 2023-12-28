import { Button, Empty } from "antd";
import type { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import StudySetPreview from "../../components/shared/StudySetPreview";
import StudySetSkeleton from "../../components/shared/StudySetSkeleton";
import ProfileLayout from "../../components/layout/ProfileLayout";
import { prisma } from "../../server/db";
import { api } from "../../utils/api";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import type { User } from "@prisma/client";
import { generateSSGHelper } from "../../server/helpers/ssgHelper";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.query?.id;
  const ssg = generateSSGHelper();

  if (typeof userId !== "string") {
    throw new Error("No userId");
  }

  await ssg.user.getById.prefetch({ id: userId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId,
    },
  };
};

interface StudySetProps {
  userId: string;
}

const StudySets: NextPageWithLayout<StudySetProps> = ({ userId }) => {
  const {
    data: studySets,
    isLoading,
    isError,
    refetch,
  } = api.studySet.getAll.useQuery({
    userId,
  });

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

StudySets.getLayout = (page: ReactElement<StudySetProps>) => {
  return <ProfileLayout userId={page.props.userId}>{page}</ProfileLayout>;
};

export default StudySets;
