import { Button, Empty, Typography } from "antd";
import { NextSeo } from "next-seo";
import { useAuthDropdownContext } from "../contexts/AuthDropdownContext";
import { api } from "../utils/api";
import StudySetSkeleton from "../components/shared/StudySetSkeleton";
import StudySetPreview from "../components/shared/StudySetPreview";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [, dispatch] = useAuthDropdownContext();
  const { data: studySets, status } = api.studySet.getPopular.useQuery();

  const getStarted = () => {
    session ? void push("/latest") : dispatch("openSignup");
  };

  return (
    <>
      <NextSeo title="Quizlet 2.0" />
      <div className="relative w-full">
        <div className="m-auto mb-12 max-w-4xl lg:mb-24">
          <div className="mb-6 flex w-full justify-center">
            <Image src="/logo.svg" alt="logo" width={220} height={48} />
          </div>
          <Typography.Title className="mb-14 mt-0 text-center text-4xl font-black md:text-5xl lg:text-7xl">
            Modern solution to memorize everything
          </Typography.Title>
          <div className="flex justify-center gap-2">
            <Button onClick={getStarted} type="primary" size="large">
              Get started
            </Button>
            <a
              href="https://github.com/fkozlicki/quizlet-clone"
              target="_blank"
              rel="noreferrer"
            >
              <Button color="bg-primary" size="large">
                Github
              </Button>
            </a>
          </div>
        </div>
        <Typography.Title level={2} className="mb-6 text-2xl font-bold">
          New study sets
        </Typography.Title>
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
      </div>
    </>
  );
};

export default Home;
