import React from "react";
import { SettingsIcon } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Separator } from "@acme/ui/separator";
import { Switch } from "@acme/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

import { useFlashcardsModeContext } from "~/contexts/flashcards-mode-context";

const FlashcardsGameSettingsDialog = () => {
  const {
    sorting,
    reset,
    toggleSorting,
    starredOnly,
    toggleStarredOnly,
    disableStarredOnly,
  } = useFlashcardsModeContext();

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <SettingsIcon className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-medium">Cards sorting</span>
            <span className="text-sm text-muted-foreground">
              Divides cards into two groups - easy and hard. You can then play
              on hard ones only.
            </span>
          </div>
          <Switch checked={sorting} onCheckedChange={toggleSorting} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="font-medium">Study only starred terms</span>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch
                    disabled={disableStarredOnly}
                    checked={starredOnly}
                    onCheckedChange={toggleStarredOnly}
                  />
                </div>
              </TooltipTrigger>
              {disableStarredOnly && (
                <TooltipContent>
                  You have to star some terms to use this feature
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator />
        <div>
          <Button onClick={reset} variant="destructive">
            Restart Flashcards
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashcardsGameSettingsDialog;
