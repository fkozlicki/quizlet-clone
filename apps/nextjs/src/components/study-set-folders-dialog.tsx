"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

import type { Session } from "@acme/auth";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

import { useFolderDialogContext } from "~/contexts/folder-dialog-context";
import { api } from "~/trpc/react";
import AddStudySetCard from "./add-study-set-card";

interface StudySetFoldersDialogProps {
  session: Session;
}

const StudySetFoldersDialog = ({ session }: StudySetFoldersDialogProps) => {
  const { id }: { id: string } = useParams();
  const { data: folders } = api.folder.allByUser.useQuery({
    userId: session.user.id,
  });
  const { data: studySet } = api.studySet.byId.useQuery({ id });
  const [, dispatch] = useFolderDialogContext();

  const openFolderDialog = () => {
    dispatch({ type: "open" });
  };

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline">
                <Plus size={16} />
                <span className="sr-only">Add to folder</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to folder</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this file from our servers?
          </DialogDescription>
        </DialogHeader>
        <Button onClick={openFolderDialog}>Create new folder</Button>
        {folders && (
          <div className="flex flex-col gap-4">
            {folders.map((folder) => (
              <AddStudySetCard
                key={folder.id}
                folderId={folder.id}
                studySetId={id}
                isIn={(studySet?.folders ?? []).some((f) => f.id === folder.id)}
                revalidate="studySet"
                name={folder.name}
              />
            ))}
          </div>
        )}
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudySetFoldersDialog;
