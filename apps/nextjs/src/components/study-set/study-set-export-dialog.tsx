"use client";

import { useState } from "react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

interface StudySetExportDialogProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StudySetExportDialog = ({
  id,
  open,
  onOpenChange,
}: StudySetExportDialogProps) => {
  const utils = api.useUtils();
  const studySet = utils.studySet.byId.getData({ id });
  const [copied, setCopied] = useState<boolean>(false);

  if (!studySet) {
    return null;
  }

  const content = studySet.flashcards.reduce(
    (prev, { term, definition }, index) =>
      prev +
      `${term} - ${definition}${index === studySet.flashcards.length - 1 ? "" : "\n"}`,
    "",
  );

  const copy = () => {
    void navigator.clipboard.writeText(content);
    toast.success("Copied");
    setCopied(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Export</DialogTitle>
        </DialogHeader>
        <div>
          <Button onClick={copy} className="mb-4 w-full">
            {copied ? "Copied" : "Copy"}
          </Button>
          <div className="grid">
            <div className="invisible whitespace-pre-wrap border py-2 text-sm [grid-area:1/1]">
              {content}
            </div>
            <Textarea
              readOnly
              value={content}
              className="resize-none [grid-area:1/1]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudySetExportDialog;
