"use client";

import { useParams, useRouter } from "next/navigation";
import { RotateCcw, Undo2 } from "lucide-react";

import type { Session } from "@acme/auth";
import { Progress } from "@acme/ui/progress";
import { Separator } from "@acme/ui/separator";

import { useLearnMode } from "~/hooks/use-learn-mode";
import FlashcardCard from "../shared/flashcard-card";
import GameResult from "../shared/game-result";
import MultipleChoiceCard from "../shared/multiple-choice-card";

const LearnMode = ({ session }: { session: Session | null }) => {
  const { id }: { id: string } = useParams();

  const router = useRouter();

  const {
    chooseAnswer,
    currentCard,
    reset,
    index,
    progress,
    isCompleted,
    flashcards,
    correct,
  } = useLearnMode(id);

  const backToStudySet = () => {
    router.push(`/study-sets/${id}`);
  };

  return (
    <>
      <Progress value={progress} className="mb-4" />
      {currentCard && (
        <MultipleChoiceCard
          term={currentCard.term}
          answers={currentCard.answers}
          index={index}
          callback={chooseAnswer}
        />
      )}
      {isCompleted && (
        <>
          <div className="mb-8 text-2xl font-bold">U finished learning</div>
          <GameResult
            hard={flashcards.length - correct}
            cardCount={flashcards.length}
            firstButton={{
              text: "Learn with new set",
              description: "Learn with new set",
              Icon: <RotateCcw size={20} />,
              callback: reset,
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
            <span className="mb-4 inline-block text-xl font-bold">
              Terms studied in this round
            </span>
            <div className="flex flex-col gap-4">
              {flashcards.map((flashcard, index) => (
                <FlashcardCard
                  key={index}
                  flashcard={flashcard}
                  session={session}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LearnMode;
