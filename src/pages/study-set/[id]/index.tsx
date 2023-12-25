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

const StudySet = () => {
  const { query } = useRouter();
  const setId = query.id?.toString();
  const {
    data: studySet,
    isLoading,
    error,
  } = api.studySet.getById.useQuery(
    {
      id: setId!,
    },
    {
      enabled: !!query.id,
    }
  );
  const [editFlashcard, setEditFlashcard] = useState<Flashcard>();

  if (isLoading || !setId) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  const otherSets = studySet.user.studySets;
  const {
    title,
    cards,
    userId,
    user: { image, name },
  } = studySet;

  const closeEditModal = () => {
    setEditFlashcard(undefined);
  };

  const openEditModal = (flashcard: Flashcard) => {
    setEditFlashcard(flashcard);
  };

  return (
    <>
      <NextSeo title={`Quizlet 2.0 - Study set ${title}`} />
      <div className="m-auto max-w-3xl">
        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">
          {studySet.title}
        </h1>
        {studySet.description && (
          <p className="mb-4 text-lg">{studySet.description}</p>
        )}
        <StudyModes setId={setId} />
        <FlashcardsGame
          cards={studySet.cards}
          ownerId={studySet.userId}
          openEditModal={openEditModal}
        />
        <FlashcardModal flashcard={editFlashcard} closeModal={closeEditModal} />
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CreatedBy userImage={image} userName={name} />
          <StudySetCTA userId={userId} setId={setId} />
        </div>
        <CardsList cards={cards} setId={setId} openEditModal={openEditModal} />
        {otherSets.length > 0 && <OtherSets otherSets={otherSets} />}
      </div>
    </>
  );
};

export default StudySet;
