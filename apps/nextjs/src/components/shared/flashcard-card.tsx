"use client";

import { Star } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

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
      <CardContent className="flex flex-col gap-2 p-4 sm:flex-row">
        <div className="order-2 flex h-6 items-center justify-end gap-1">
          {editable && <EditFlashcardDialog flashcard={flashcard} />}
          <Button
            onClick={toggleStar}
            size="icon"
            variant="ghost"
            className="rounded-full"
          >
            <Star
              className={flashcard.starred ? "text-yellow-300" : undefined}
              size={16}
            />
          </Button>
        </div>
        <div className="whitespace-pre-line sm:flex-1">{term}</div>
        <Separator className="my-2 sm:hidden" />
        <div className="mx-4 hidden sm:block">
          <Separator orientation="vertical" />
        </div>
        <div className="whitespace-pre-line sm:flex-1">{definition}</div>
      </CardContent>
    </Card>
  );
};

export default FlashcardCard;
