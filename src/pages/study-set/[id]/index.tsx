import { Button, Typography } from "antd";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import FlashcardsGame from "../../../components/flashcards-mode/FlashcardsGame";
import CreatedBy from "../../../components/study-set/CreatedBy";
import FlashcardsList from "../../../components/study-set/FlashcardsList";
import OtherSets from "../../../components/study-set/OtherSets";
import StudyModes from "../../../components/study-set/StudyModes";
import StudySetCTA from "../../../components/study-set/StudySetCTA";
import { generateSSGHelper } from "../../../server/helpers/ssgHelper";
import { api } from "../../../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = generateSSGHelper();
  const setId = context.query?.id;

  if (typeof setId !== "string") {
    throw new Error("No setId");
  }

  await ssg.studySet.getById.prefetch({ id: setId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      setId,
    },
  };
};

const StudySet = ({ setId }: { setId: string }) => {
  const { data: session } = useSession();
  const { data: studySet } = api.studySet.getById.useQuery(
    {
      id: setId,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: starredFlashcards } = api.starredFlashcard.getSetCards.useQuery(
    {
      setId,
    },
    {
      enabled: !!session,
    }
  );

  if (!studySet) {
    return <div>404</div>;
  }

  const { title, cards, userId, user, description } = studySet;
  const { studySets: otherSets } = user;

  return (
    <>
      <NextSeo title={`Quizlet 2.0 - Study set ${title}`} />
      <div className="m-auto max-w-3xl">
        <div className="mb-4">
          <Typography.Title className="mb-0 text-2xl font-bold sm:text-3xl">
            {title}
          </Typography.Title>
          {description && (
            <Typography.Text className="text-base">
              {description}
            </Typography.Text>
          )}
        </div>
        <StudyModes setId={setId} />
        <FlashcardsGame
          starredFlashcards={starredFlashcards}
          setId={setId}
          cards={cards}
          ownerId={userId}
        />
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CreatedBy user={user} />
          <StudySetCTA studySetName={title} userId={userId} setId={setId} />
        </div>
        <FlashcardsList userId={userId} cards={cards} />
        {userId === session?.user.id && (
          <Link href={`${setId}/edit`}>
            <Button
              type="primary"
              className="m-auto mb-8 block h-14 font-bold"
              size="large"
            >
              Add or Remove Terms
            </Button>
          </Link>
        )}
        {otherSets.length > 0 && <OtherSets otherSets={otherSets} />}
      </div>
    </>
  );
};

export default StudySet;
