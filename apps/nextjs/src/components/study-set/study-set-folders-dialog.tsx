"use client";

import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

import type { Session } from "@acme/auth";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import Empty from "@acme/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

import { useFolderDialogContext } from "~/contexts/folder-dialog-context";
import { api } from "~/trpc/react";
import StudySetFolderCard from "./study-set-folder-card";

interface StudySetFoldersDialogProps {
  session: Session;
}

const StudySetFoldersDialog = ({ session }: StudySetFoldersDialogProps) => {
  const { id }: { id: string } = useParams();
  const [folders] = api.folder.allByUser.useSuspenseQuery({
    userId: session.user.id,
  });
  const [studySet] = api.studySet.byId.useSuspenseQuery({ id });
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
          <DialogTitle>Folders</DialogTitle>
          <DialogDescription>
            Add or remove your set from folders
          </DialogDescription>
        </DialogHeader>
        <Button onClick={openFolderDialog}>Create new folder</Button>
        {folders.length ? (
          <div className="flex flex-col gap-4">
            {folders.map((folder) => {
              return (
                <StudySetFolderCard
                  key={folder.id}
                  isIn={studySet.folders.some((f) => f.id === folder.id)}
                  folder={folder}
                  studySetId={id}
                />
              );
            })}
          </div>
        ) : (
          <Empty message="You have no folders yet" className="my-3" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudySetFoldersDialog;
