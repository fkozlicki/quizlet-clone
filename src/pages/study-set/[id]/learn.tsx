import { ArrowPathIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useState, type MouseEvent } from "react";
import CardPreview from "../../../components/CardPreview";
import MultipleChoice from "../../../components/cards/MultipleChoice";
import ProgressBar from "../../../components/ProgressBar";
import Result from "../../../components/Result";
import { api } from "../../../utils/api";

const Learn = () => {
  const { query, push } = useRouter();
  const setId = query.id?.toString();
  const {
    data: cards,
    isLoading,
    refetch,
  } = api.studySet.getLearnSet.useQuery(
    { id: setId! },
    {
      refetchOnWindowFocus: false,
      enabled: !!setId,
    }
  );
  const [cardIndex, setCardIndex] = useState<number>(0);
  const currentCard = cards?.[cardIndex];
  const [disabled, setDisabled] = useState<boolean>(false);
  const [correct, setCorrect] = useState<number>(0);

  const resetLearning = async () => {
    await refetch();
    setCardIndex(0);
    setCorrect(0);
  };

  const chooseAnswer = (index: number, event: MouseEvent) => {
    if (disabled) return;
    const button = event.target as HTMLDivElement;
    const selectedAnswer = currentCard?.answers[index];
    if (!selectedAnswer) return;

    let borderColor: string;
    let backgroundColor: string;

    if (selectedAnswer === currentCard.definition) {
      borderColor = "border-green-500";
      backgroundColor = "bg-green-50";
      setCorrect((prev) => prev + 1);
    } else {
      borderColor = "border-red-500";
      backgroundColor = "bg-red-50";
    }
    setDisabled(true);
    button.classList.add(borderColor, backgroundColor);

    setTimeout(() => {
      setDisabled(false);
      button.classList.remove(borderColor, backgroundColor);
      setCardIndex((prev) => prev + 1);
    }, 1000);
  };

  if (isLoading || !setId) return <div>Loading...</div>;

  const backToStudySet = async () => {
    await push(`/study-set/${setId}`);
  };

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Learn" />
      <div className="bg-slate-100">
        <div className="m-auto max-w-[65rem] p-4 md:py-12">
          {cards && <ProgressBar value={cardIndex} max={cards.length} />}
          {currentCard && (
            <MultipleChoice
              term={currentCard.term}
              answers={currentCard.answers}
              index={cardIndex}
              callback={chooseAnswer}
              type="button"
            />
          )}
          {cards && cardIndex === cards.length && (
            <div>
              <div className="mb-8 text-2xl font-bold">U finished learning</div>
              <Result
                know={correct}
                learning={cards.length - correct}
                firstButton={{
                  text: "Lear with new set",
                  Icon: ArrowPathIcon,
                  callback: resetLearning,
                }}
                secondButton={{
                  text: "Back to study set",
                  Icon: ArrowUturnLeftIcon,
                  callback: backToStudySet,
                }}
              />
              <div>
                <div className="mb-4 text-xl font-bold text-gray-600">
                  Terms studied in this round
                </div>
                <div className="flex max-w-3xl flex-col gap-4">
                  {cards.map(({ term, definition }, index) => (
                    <CardPreview
                      key={index}
                      term={term}
                      definition={definition}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Learn;
