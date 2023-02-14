import {
  AcademicCapIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/solid";
import type { Flashcard } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import FlippingCard from "../../../components/FlippingCard";
import { api } from "../../../utils/api";

interface FlashcardsProgress {
  learning: Flashcard[];
  know: Flashcard[];
}

const Flashcards = () => {
  const { query } = useRouter();
  const id = query.id?.toString();
  const [cards, setCards] = useState<Flashcard[]>();
  const [cardIndex, setCardIndex] = useState<number>(0);
  const {
    data: studySet,
    isLoading,
    refetch,
  } = api.studySet.getById.useQuery(
    {
      id: id!,
    },
    {
      enabled: !!id,
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
        {cardIndex === cards?.length && (
          <div>
            <h1 className="mb-8 text-3xl font-semibold">
              You finished! What&apos;s next?
            </h1>
            <div className="flex flex-col gap-16 md:flex-row">
              <div className="flex-1">
                <div className="mb-4 text-xl font-bold text-slate-600">
                  Your results
                </div>
                <div className="flex gap-4">
                  <PieChart
                    data={[{ value: know.length, color: "#4ade80" }]}
                    totalValue={studySet?.cards.length}
                    lineWidth={25}
                    rounded
                    startAngle={270}
                    background="#fb923c"
                    label={({ dataEntry }) => (
                      <text
                        dominantBaseline="central"
                        x="50"
                        y="50"
                        dx="0"
                        dy="0"
                        color="red"
                        textAnchor="middle"
                        className="font-medium"
                      >
                        {dataEntry.percentage}%
                      </text>
                    )}
                    labelStyle={{
                      fontWeight: "500",
                      color: "#fff",
                    }}
                    labelPosition={0}
                    style={{
                      width: "96px",
                      height: "96px",
                    }}
                  />
                  <div className="flex gap-4">
                    <div className="flex flex-col justify-evenly">
                      <div className="text-xl font-medium text-green-600">
                        Know
                      </div>
                      <div className="text-xl font-medium text-orange-600">
                        Still learning
                      </div>
                    </div>
                    <div className="flex flex-col justify-evenly">
                      <div className="rounded-full border border-green-300 bg-green-100 px-4 text-xl font-medium text-green-600">
                        {know.length}
                      </div>
                      <div className="rounded-full border border-orange-300 bg-orange-100 px-4 text-xl font-medium text-orange-600">
                        {learning.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-4 text-xl font-bold text-slate-600">
                  Next steps
                </div>
                <div className="flex flex-col gap-4">
                  {learning.length > 0 ? (
                    <button
                      onClick={reviewToughTerms}
                      className="flex gap-4 rounded-lg border-2 border-transparent bg-white p-4 shadow-md hover:border-slate-300"
                    >
                      <ArrowUturnLeftIcon width={28} />
                      <div>Review the tough terms</div>
                    </button>
                  ) : (
                    <Link
                      href={`/study-set/${id!}`}
                      className="flex gap-4 rounded-lg border-2 border-transparent bg-white p-4 shadow-md hover:border-slate-300"
                    >
                      <>
                        <AcademicCapIcon width={28} />
                        <div>Back to study set</div>
                      </>
                    </Link>
                  )}

                  <button
                    onClick={resetFlashcards}
                    className="flex gap-4 rounded-lg border-2 border-transparent bg-white p-4 shadow-md hover:border-slate-300"
                  >
                    <ArrowPathIcon width={28} />
                    <div>Restart Flashcards</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {studySet && cards && currentCard && (
          <div>
            <div className="mb-6 flex justify-between">
              <div className="flex items-center gap-2 font-medium text-orange-600">
                <span className="rounded-full border border-orange-300 bg-orange-100 px-3">
                  {learning.length}
                </span>
                <span>Still learning</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-green-600">
                Know
                <span className="rounded-full border border-green-300 bg-green-100 px-3">
                  {know.length}
                </span>
              </div>
            </div>
            <div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
