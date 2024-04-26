import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Maximize,
  Settings,
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

interface FlashcardButtonsProps {
  cardIndex: number;
  cardCount: number;
  sorting: boolean;
  setId: string;
  handleLeft: () => void;
  handleRight: () => void;
  openSettingsModal: () => void;
  shuffle: () => void;
  fullscreen?: boolean;
}

const FlashcardsGameButtons = ({
  sorting,
  cardIndex,
  cardCount,
  setId,
  handleLeft,
  handleRight,
  shuffle,
  openSettingsModal,
  fullscreen,
}: FlashcardButtonsProps) => {
  return (
    <div className="relative mb-4 mt-4 flex justify-center">
      <div className="relative z-10 flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleLeft}
          disabled={!sorting && cardIndex === 0}
          className={cn("rounded-full", {
            "hover:border-red-500 hover:text-red-500": sorting,
          })}
          size="icon"
        >
          {sorting ? <X /> : <ArrowLeft />}
        </Button>
        <span className="select-none font-semibold tracking-[0.4em] text-muted-foreground">
          {cardIndex + 1}/{cardCount}
        </span>
        <Button
          variant="outline"
          onClick={handleRight}
          disabled={cardIndex === cardCount}
          className={cn("rounded-full", {
            "hover:border-green-600 hover:text-green-600": sorting,
          })}
          size="icon"
        >
          {sorting ? <Check /> : <ArrowRight />}
        </Button>
      </div>
      <div className="absolute top-0 flex h-full w-full items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={shuffle} size="icon">
                <Shuffle size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Shuffle</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={openSettingsModal}
                  size="icon"
                >
                  <Settings size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {!fullscreen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/study-sets/${setId}/flashcards`}>
                    <Button variant="outline" size="icon">
                      <Maximize size={18} />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Fullscreen</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardsGameButtons;
