import { Button, Card, Empty, Skeleton } from "antd";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import StudySetPreview from "../components/StudySetPreview";
import { api } from "../utils/api";
import Link from "next/link";

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

const StudySetSkeleton = () => {
  return (
    <Card>
      <Skeleton active title={false} className="mb-4" />
      <Skeleton.Avatar active size="small" />
    </Card>
  );
};

const Latest = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: studySets, isLoading } = api.studySet.getUserSets.useQuery({
    id: user.id,
  });

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Latest" />
      <div className="min-h-screen bg-slate-100 py-5 sm:py-10">
        <div className="mx-4 max-w-6xl sm:mx-6 xl:m-auto">
          {studySets?.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}>
              <Link href="/create-set">
                <Button type="primary">Create Now</Button>
              </Link>
            </Empty>
          ) : (
            <div>
              <h1 className="mb-8 text-lg font-medium">Your study sets</h1>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {isLoading && (
                  <>
                    <StudySetSkeleton />
                    <StudySetSkeleton />
                    <StudySetSkeleton />
                    <StudySetSkeleton />
                  </>
                )}
                {studySets &&
                  studySets.map((set) => (
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Latest;
