"use client";

import type { MouseEvent } from "react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RotateCcw, Undo2 } from "lucide-react";

import { Progress } from "@acme/ui/progress";
import { Separator } from "@acme/ui/separator";

import { api } from "~/trpc/react";
import FlashcardCard from "./flashcard-card";
import GameResult from "./game-result";
import MultipleChoiceCard from "./multiple-choice-card";

const LearnMode = () => {
  const { id }: { id: string } = useParams();
  const { data: flashcards } = api.studySet.learnCards.useQuery(
    { id },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [correct, setCorrect] = useState<number>(0);
  const utils = api.useUtils();
  const router = useRouter();

  const currentCard = flashcards![cardIndex];

  const resetLearning = async () => {
    await utils.studySet.learnCards.invalidate();
    setCardIndex(0);
    setCorrect(0);
  };

  const chooseAnswer = (index: number, event: MouseEvent) => {
    const selectedAnswer = currentCard?.answers[index];

    if (disabled || !selectedAnswer) return;

    setDisabled(true);

    const button = event.currentTarget as HTMLDivElement;

    let borderColor: string;
    let backgroundColor: string;

    if (selectedAnswer === currentCard.definition) {
      borderColor = "#16a34a";
      backgroundColor = "#bbf7d0";
      setCorrect((prev) => prev + 1);
    } else {
      borderColor = "#e11d48";
      backgroundColor = "#fda4af";
    }

    button.style.background = backgroundColor;
    button.style.borderColor = borderColor;

    setTimeout(() => {
      button.style.background = "hsla(var(--background))";
      button.style.borderColor = "hsla(var(--input))";
      setDisabled(false);
      setCardIndex((prev) => prev + 1);
    }, 1000);
  };

  const backToStudySet = () => {
    router.push(`/study-sets/${id}`);
  };

  return (
    <>
      <Progress
        value={(cardIndex / flashcards!.length) * 100}
        className="mb-4"
      />
      {currentCard && (
        <MultipleChoiceCard
          term={currentCard.term}
          answers={currentCard.answers}
          index={cardIndex}
          callback={chooseAnswer}
        />
      )}
      {flashcards && cardIndex === flashcards.length && (
        <>
          <div className="mb-8 text-2xl font-bold">U finished learning</div>
          <GameResult
            hard={flashcards.length - correct}
            cardCount={flashcards.length}
            firstButton={{
              text: "Learn with new set",
              description: "Learn with new set",
              Icon: <RotateCcw size={20} />,
              callback: resetLearning,
            }}
            secondButton={{
              text: "Back to study set",
              description: "Back to study set",
              Icon: <Undo2 size={20} />,
              callback: backToStudySet,
            }}
          />
          <Separator className="my-4 md:my-8" />
          <div>
            <span className="mb-4 text-xl font-bold">
              Terms studied in this round
            </span>
            <div className="flex flex-col gap-4">
              {flashcards.map((flashcard, index) => (
                <FlashcardCard key={index} flashcard={flashcard} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LearnMode;
