"use client";

import { Star } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";

import useStar from "~/hooks/useStar";
import EditFlashcardDialog from "../shared/edit-flashcard-dialog";

interface FlipCardContentProps {
  title: string;
  content: string;
  editable?: boolean;
  back?: boolean;
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][0];
}

const FlipCardContent = ({
  back,
  title,
  content,
  editable,
  flashcard,
}: FlipCardContentProps) => {
  const { toggleStar } = useStar(flashcard);

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
              onClick={toggleStar}
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
