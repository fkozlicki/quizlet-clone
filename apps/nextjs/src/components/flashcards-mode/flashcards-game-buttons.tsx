"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Maximize,
  Shuffle,
  X,
} from "lucide-react";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

import { useFlashcardsModeContext } from "~/contexts/flashcards-mode-context";
import FlashcardsGameSettingsDialog from "./flashcards-game-settings-dialog";

interface FlashcardButtonsProps {
  fullscreen?: boolean;
}

const FlashcardsGameButtons = ({ fullscreen }: FlashcardButtonsProps) => {
  const { id }: { id: string } = useParams();
  const { shuffle, handleLeft, handleRight, index, sorting, count } =
    useFlashcardsModeContext();

  return (
    <div className="relative mb-4 mt-4 flex justify-center">
      <div className="relative z-10 flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleLeft}
          disabled={!sorting && index === 0}
          className={cn("rounded-full", {
            "hover:border-red-500 hover:text-red-500": sorting,
          })}
          size="icon"
        >
          {sorting ? <X /> : <ArrowLeft />}
        </Button>
        <span className="select-none font-semibold text-muted-foreground">
          {index + 1} / {count}
        </span>
        <Button
          variant="outline"
          onClick={handleRight}
          disabled={index === count}
          className={cn("rounded-full", {
            "hover:border-green-600 hover:text-green-600": sorting,
          })}
          size="icon"
        >
          {sorting ? <Check /> : <ArrowRight />}
        </Button>
      </div>
      <TooltipProvider delayDuration={0}>
        <div className="absolute top-0 flex h-full w-full items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={shuffle} size="icon">
                <Shuffle size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Shuffle</TooltipContent>
          </Tooltip>
          <div className="flex gap-2">
            <FlashcardsGameSettingsDialog />

            {!fullscreen && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/study-sets/${id}/flashcards`}>
                    <Button variant="outline" size="icon">
                      <Maximize size={18} />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Fullscreen</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default FlashcardsGameButtons;
