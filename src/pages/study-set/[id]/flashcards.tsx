import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import FlashcardsGame from "../../../components/FlashcardsGame";
import { api } from "../../../utils/api";
import { useState } from "react";
import type { Flashcard } from "@prisma/client";
import FlashcardModal from "../../../components/pages/study-set/FlashcardModal";

const Flashcards = () => {
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
      enabled: !!setId,
      refetchOnWindowFocus: false,
    }
  );
  const [editFlashcard, setEditFlashcard] = useState<Flashcard>();

  const closeEditModal = () => {
    setEditFlashcard(undefined);
  };

  const openEditModal = (flashcard: Flashcard) => {
    setEditFlashcard(flashcard);
  };

  if (isLoading || !setId) return <div>Loading flashcards...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Flashcards" />
      <div className="m-auto max-w-5xl">
        <FlashcardsGame
          cards={studySet.cards}
          ownerId={studySet.userId}
          size="large"
          openEditModal={openEditModal}
        />
        <FlashcardModal
          setId={setId}
          flashcard={editFlashcard}
          closeModal={closeEditModal}
        />
      </div>
    </>
  );
};

export default Flashcards;
