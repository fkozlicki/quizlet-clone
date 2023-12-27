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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.query?.id;

  if (typeof userId !== "string") {
    throw new Error("No userId");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
    },
  };
};

interface StudySetProps {
  user: User;
}

const StudySets: NextPageWithLayout<StudySetProps> = ({ user }) => {
  const {
    data: studySets,
    isLoading,
    isError,
    refetch,
  } = api.studySet.getUserSets.useQuery({
    id: user.id,
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
  return <ProfileLayout user={page.props.user}>{page}</ProfileLayout>;
};

export default StudySets;
