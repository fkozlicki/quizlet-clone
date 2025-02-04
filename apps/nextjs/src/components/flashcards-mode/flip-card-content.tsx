"use client";

import type { MouseEvent } from "react";
import { Star } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import type { Session } from "@acme/auth";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";

import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";
import useStar from "~/hooks/useStar";
import EditFlashcardDialog from "../shared/edit-flashcard-dialog";

interface FlipCardContentProps {
  title: string;
  content: string;
  editable?: boolean;
  back?: boolean;
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][0];
  session: Session | null;
}

const FlipCardContent = ({
  back,
  title,
  content,
  editable,
  flashcard,
  session,
}: FlipCardContentProps) => {
  const { toggleStar } = useStar(flashcard);
  const { onOpenChange } = useSignInDialogContext();

  const onStarClick = (event: MouseEvent) => {
    event.stopPropagation();

    if (session) {
      toggleStar();
    } else {
      onOpenChange(true);
    }
  };

  return (
    <div
      className={cn("absolute h-full w-full [backface-visibility:hidden]", {
        "[transform:rotateX(180deg)]": back,
      })}
    >
      <div className="flex h-full w-full flex-col rounded-lg bg-primary-foreground p-4 drop-shadow-lg md:p-6">
        <div className="flex items-center justify-between">
          <span className="select-none font-semibold">{title}</span>
          <div className="flex justify-end gap-2">
            {editable && <EditFlashcardDialog flashcard={flashcard} />}
            <Button
              className="rounded-full"
              onClick={onStarClick}
              variant="ghost"
              size="icon"
            >
              <Star
                size={16}
                className={flashcard.starred ? "text-yellow-300" : undefined}
              />
            </Button>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <span className="select-none text-3xl">{content}</span>
        </div>
      </div>
    </div>
  );
};

export default FlipCardContent;
