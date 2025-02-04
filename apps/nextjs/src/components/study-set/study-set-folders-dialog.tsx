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
          <DialogTitle>Folders</DialogTitle>
          <DialogDescription>
            Add or remove your set from folders
          </DialogDescription>
        </DialogHeader>
        <Button onClick={openFolderDialog}>Create new folder</Button>
        {folders?.length ? (
          <div className="flex flex-col gap-4">
            {folders.map((folder) => {
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
        ) : (
          <Empty message="You have no folders yet" className="my-3" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudySetFoldersDialog;
