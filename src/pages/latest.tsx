import { Button, Empty } from "antd";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import StudySetPreview from "../components/shared/StudySetPreview";
import StudySetSkeleton from "../components/shared/StudySetSkeleton";
import { api } from "../utils/api";

export const getServerSideProps: GetServerSideProps<{
  user: Session["user"];
}> = async (context) => {
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
      user: session.user,
    },
  };
};

const Latest = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: studySets, status } = api.studySet.getAll.useQuery({
    userId: user.id,
  });

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Latest" />
      <>
        <div className="mb-6 text-2xl font-medium">Your study sets</div>
        {status === "loading" && (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <StudySetSkeleton />
            <StudySetSkeleton />
            <StudySetSkeleton />
            <StudySetSkeleton />
          </div>
        )}
        {status === "error" && <div>Couldn&apos;t load sets</div>}
        {status === "success" && (
          <>
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
        )}
      </>
    </>
  );
};

export default Latest;
