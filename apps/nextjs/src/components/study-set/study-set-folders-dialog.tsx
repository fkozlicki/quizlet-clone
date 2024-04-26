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
import AddStudySetCard from "../shared/add-study-set-card";

interface StudySetFoldersDialogProps {
  session: Session;
}

const StudySetFoldersDialog = ({ session }: StudySetFoldersDialogProps) => {
  const utils = api.useUtils();
  const { id }: { id: string } = useParams();
  const { data: folders } = api.folder.allByUser.useQuery({
    userId: session.user.id,
  });
  const { data: studySet } = api.studySet.byId.useQuery({ id });
  const [, dispatch] = useFolderDialogContext();

  const openFolderDialog = () => {
    dispatch({ type: "open" });
  };

  const onMutate = (folderId: string, isIn: boolean) => {
    const prevData = utils.studySet.byId.getData({ id });

    utils.studySet.byId.setData({ id }, (old) => {
      if (!old) {
        return;
      }

      return {
        ...old,
        folders: isIn
          ? old.folders.filter((folder) => folder.id !== folderId)
          : [...old.folders, { id: folderId }],
      };
    });

    return {
      prevData,
    };
  };

  const onSettled = async () => {
    await utils.studySet.byId.invalidate({ id });
  };

  if (!studySet) {
    return null;
  }

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
        <div className="flex flex-col gap-4">
          {folders?.map((folder) => {
            const isIn = studySet.folders.some((f) => f.id === folder.id);

            return (
              <AddStudySetCard
                key={folder.id}
                folderId={folder.id}
                studySetId={id}
                name={folder.name}
                isIn={isIn}
                onMutate={() => onMutate(folder.id, isIn)}
                onSettled={onSettled}
              />
            );
          })}
        </div>
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudySetFoldersDialog;
