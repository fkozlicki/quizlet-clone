"use client";

import { Star } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

import useStar from "~/hooks/useStar";
import EditFlashcardDialog from "./edit-flashcard-dialog";

interface FlashcardCardProps {
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][0];
  editable?: boolean;
}

const FlashcardCard = ({ flashcard, editable }: FlashcardCardProps) => {
  const { term, definition } = flashcard;
  const { toggleStar } = useStar(flashcard);

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
        <div className="order-2 flex justify-end gap-1">
          {editable && <EditFlashcardDialog flashcard={flashcard} />}
          <Button onClick={toggleStar} size="icon" variant="ghost">
            <Star
              className={flashcard.starred ? "text-yellow-300" : undefined}
              size={16}
            />
          </Button>
        </div>
        <div className="border-slate-200 sm:basis-1/2 sm:border-r sm:pr-8">
          <span className="text-base">{term}</span>
        </div>
        <div className="sm:basis-1/2 sm:px-8">
          <span className="text-base">{definition}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardCard;
