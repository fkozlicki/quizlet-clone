"use client";

import { Star } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import type { Session } from "@acme/auth";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";
import useStar from "~/hooks/use-star";
import EditFlashcardDialog from "./edit-flashcard-dialog";

interface FlashcardCardProps {
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][number];
  editable?: boolean;
  session: Session | null;
}

const FlashcardCard = ({
  flashcard,
  editable,
  session,
}: FlashcardCardProps) => {
  const { term, definition } = flashcard;
  const { toggleStar } = useStar(flashcard);
  const { onOpenChange } = useSignInDialogContext();

  const onStarClick = () => {
    if (session) {
      toggleStar();
    } else {
      onOpenChange(true);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4 sm:flex-row">
        <div className="order-2 flex h-6 items-center justify-end gap-1">
          {editable && <EditFlashcardDialog flashcard={flashcard} />}
          <Button
            onClick={onStarClick}
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
