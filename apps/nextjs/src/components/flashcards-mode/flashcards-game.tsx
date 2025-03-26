"use client";

import { useParams, useRouter } from "next/navigation";
import { GraduationCap, RotateCcw, Undo2 } from "lucide-react";

import type { Session } from "@acme/auth";
import { Progress } from "@acme/ui/progress";

import { useFlashcardsModeContext } from "~/contexts/flashcards-mode-context";
import GameResult from "../shared/game-result";
import FlashcardsGameButtons from "./flashcards-game-buttons";
import FlipCard from "./flip-card";
import MessageCard from "./message-card";

export type FlashcardAnimation = "left" | "right" | "know" | "learning" | null;

interface FlashcardsGameProps {
  session: Session | null;
  fullscreen?: boolean;
}

const FlashcardsGame = ({ fullscreen, session }: FlashcardsGameProps) => {
  const {
    currentCard,
    count,
    hardCount,
    sorting,
    reset,
    reviewHard,
    progress,
  } = useFlashcardsModeContext();
  const router = useRouter();
  const { id }: { id: string } = useParams();

  const learnFlashcards = () => {
    router.push(`/study-sets/${id}/learn`);
  };

  const backToStudySet = () => {
    router.push(`/study-sets/${id}`);
  };

  const firstButton = {
    text:
      hardCount > 0
        ? "Review the tough terms"
        : !fullscreen
          ? "Learn flashcards"
          : "Back to set",
    description:
      hardCount > 0
        ? `Review Flashcards again with the ${hardCount} terms you're still learing.`
        : !fullscreen
          ? "Learn flashcards"
          : "Get back to the study set.",
    callback:
      hardCount > 0
        ? reviewHard
        : !fullscreen
          ? learnFlashcards
          : backToStudySet,
    Icon: !fullscreen ? <GraduationCap size={42} /> : <Undo2 size={32} />,
  };

  const secondButton = {
    text: "Reset Flashcards",
    description: `Study all ${count} terms from the beginning.`,
    callback: reset,
    Icon: <RotateCcw size={32} />,
  };

  if (!currentCard) {
    return (
      <GameResult
        hard={hardCount}
        cardCount={count}
        firstButton={firstButton}
        secondButton={secondButton}
      />
    );
  }

  return (
    <>
      <div className="relative flex [perspective:1000px]">
        {sorting && <MessageCard />}
        <FlipCard fullscreen={fullscreen} session={session} />
      </div>

      <FlashcardsGameButtons fullscreen={fullscreen} />

      <Progress value={progress} className="mb-6" />
    </>
  );
};

export default FlashcardsGame;
