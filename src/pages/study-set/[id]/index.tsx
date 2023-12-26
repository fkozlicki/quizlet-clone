import type { Flashcard } from "@prisma/client";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
import FlashcardsGame from "../../../components/FlashcardsGame";
import CardsList from "../../../components/pages/study-set/CardsList";
import CreatedBy from "../../../components/pages/study-set/CreatedBy";
import FlashcardModal from "../../../components/pages/study-set/FlashcardModal";
import OtherSets from "../../../components/pages/study-set/OtherSets";
import StudyModes from "../../../components/pages/study-set/StudyModes";
import StudySetCTA from "../../../components/pages/study-set/StudySetCTA";
import { api } from "../../../utils/api";
import { Button, Skeleton } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";

const StudySet = () => {
  const { data: session } = useSession();
  const { query } = useRouter();
  const { id: setId } = query as { id?: string };
  const {
    data: studySet,
    isLoading,
    error,
    refetch,
  } = api.studySet.getById.useQuery(
    {
      id: setId!,
    },
    {
      enabled: !!setId,
    }
  );
  const [editFlashcard, setEditFlashcard] = useState<Flashcard>();

  const closeEditModal = () => {
    setEditFlashcard(undefined);
  };

  const openEditModal = (flashcard: Flashcard) => {
    setEditFlashcard(flashcard);
  };

  if (isLoading || !setId)
    return (
      <div className="m-auto max-w-3xl">
        <Skeleton.Input className="mb-6 block" />
        <Skeleton.Input className="mb-6 h-4" />
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Skeleton.Input className="h-12 w-full" />
          <Skeleton.Input className="h-12 w-full" />
          <Skeleton.Input className="h-12 w-full" />
          <Skeleton.Input className="h-12 w-full" />
        </div>
        <Skeleton.Input className="mb-6 h-[400px] w-full" />
        <Skeleton />
      </div>
    );

  if (error) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg">Failed to load data</div>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    );
  }

  const { title, cards, userId, user, description } = studySet;
  const { studySets: otherSets } = user;

  return (
    <>
      <NextSeo title={`Quizlet 2.0 - Study set ${title}`} />
      <div className="m-auto max-w-3xl">
        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mb-4 text-lg">{description}</p>}
        <StudyModes setId={setId} />
        <FlashcardsGame
          cards={cards}
          ownerId={userId}
          openEditModal={openEditModal}
        />
        <FlashcardModal
          setId={setId}
          flashcard={editFlashcard}
          closeModal={closeEditModal}
        />
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CreatedBy user={user} />
          <StudySetCTA userId={userId} setId={setId} />
        </div>
        <CardsList
          userId={userId}
          cards={cards}
          openEditModal={openEditModal}
        />
        {userId === session?.user.id && (
          <div className="flex justify-center">
            <Link href={`${setId}/edit`}>
              <Button type="primary" className="h-14 font-medium" size="large">
                Add or Remove Terms
              </Button>
            </Link>
          </div>
        )}
        {otherSets.length > 0 && <OtherSets otherSets={otherSets} />}
      </div>
    </>
  );
};

export default StudySet;
