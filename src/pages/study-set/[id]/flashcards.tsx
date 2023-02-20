import type { Flashcard } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FlippingCard from "../../../components/FlippingCard";
import Score from "../../../components/pages/flashcards/Score";
import Result from "../../../components/Result";
import { api } from "../../../utils/api";

interface FlashcardsProgress {
  learning: Flashcard[];
  know: Flashcard[];
}

const Flashcards = () => {
  const { query } = useRouter();
  const setId = query.id?.toString();
  const [cards, setCards] = useState<Flashcard[]>();
  const [cardIndex, setCardIndex] = useState<number>(0);
  const {
    data: studySet,
    isLoading,
    refetch,
  } = api.studySet.getById.useQuery(
    {
      id: setId!,
    },
    {
      enabled: !!setId,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        setCards(data.cards);
      },
    }
  );
  const currentCard = cards?.[cardIndex];
  const [{ know, learning }, setProgress] = useState<FlashcardsProgress>({
    learning: [],
    know: [],
  });

  const reviewToughTerms = () => {
    setCards(learning);

    setProgress((prev) => ({
      ...prev,
      learning: [],
    }));

    setCardIndex(0);
  };

  const resetFlashcards = () => {
    if (!studySet) return;
    setCards(studySet.cards);
    setProgress({
      know: [],
      learning: [],
    });
    setCardIndex(0);
  };

  const addToKnow = () => {
    if (!currentCard) return;
    setProgress((prev) => ({ ...prev, know: [...prev.know, currentCard] }));
  };

  const addToLearning = () => {
    if (!currentCard) return;
    setProgress((prev) => ({
      ...prev,
      learning: [...prev.learning, currentCard],
    }));
  };

  const changeCard = (value: number) => {
    setCardIndex((prev) => prev + value);
  };

  if (isLoading) return <div>Loading flashcards...</div>;

  return (
    <div className="bg-slate-100">
      <div className="m-auto max-w-[65rem] p-4 md:py-12">
        {cardIndex === cards?.length && setId && (
          <div>
            <h1 className="mb-8 text-3xl font-semibold">
              You finished! What&apos;s next?
            </h1>
            <Result
              know={know.length}
              learning={learning.length}
              studySetId={setId}
            />
          </div>
        )}
        {studySet && cards && currentCard && (
          <div>
            <Score know={know.length} learning={learning.length} />
            <FlippingCard
              variant="large"
              refetchSet={refetch}
              id={currentCard.id}
              userId={studySet.userId}
              term={currentCard.term}
              definition={currentCard.definition}
              index={cardIndex}
              length={cards.length}
              changeCardCallback={changeCard}
              buttonVariant="description"
              addToKnow={addToKnow}
              addToLearning={addToLearning}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
