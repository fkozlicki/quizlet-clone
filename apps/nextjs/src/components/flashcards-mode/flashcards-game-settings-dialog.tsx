import React from "react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { Separator } from "@acme/ui/separator";
import { Switch } from "@acme/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

interface FlashcardsGameSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sorting: boolean;
  switchSorting: (value: boolean) => void;
  resetFlashcards: () => void;
  disableStarredOnly: boolean;
  starredOnly: boolean;
  switchStarredOnly: (value: boolean) => void;
}

const FlashcardsGameSettingsDialog = ({
  open,
  onOpenChange,
  sorting,
  switchSorting,
  resetFlashcards,
  disableStarredOnly,
  starredOnly,
  switchStarredOnly,
}: FlashcardsGameSettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Switch checked={sorting} onCheckedChange={switchSorting} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="font-medium">Study only starred terms</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch
                    disabled={disableStarredOnly}
                    checked={starredOnly}
                    onCheckedChange={switchStarredOnly}
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
          <Button onClick={resetFlashcards} variant="destructive">
            Restart Flashcards
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashcardsGameSettingsDialog;
