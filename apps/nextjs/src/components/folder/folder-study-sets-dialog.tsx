"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
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

import { api } from "~/trpc/react";
import AddStudySetCard from "../shared/add-study-set-card";

interface FolderStudySetsDialogProps {
  userId: string;
}

const FolderStudySetsDialog = ({ userId }: FolderStudySetsDialogProps) => {
  const utils = api.useUtils();
  const { slug }: { slug: string } = useParams();
  const { data: studySets } = api.studySet.allByUser.useQuery({ userId });
  const { data: folder } = api.folder.bySlug.useQuery({ slug });

  const onMutate = (
    studySet: RouterOutputs["folder"]["bySlug"]["studySets"][0],
    isIn: boolean,
  ) => {
    const prevData = utils.folder.bySlug.getData({ slug });

    utils.folder.bySlug.setData({ slug }, (old) => {
      if (!old) {
        return;
      }

      return {
        ...old,
        studySets: isIn
          ? old.studySets.filter((set) => set.id !== studySet.id)
          : [...old.studySets, studySet].sort((a, b) =>
              a.title.localeCompare(b.title),
            ),
      };
    });

    return {
      prevData,
    };
  };

  const onSettled = async () => {
    await utils.folder.bySlug.invalidate({ slug });
  };

  if (!folder) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add/remove study set from folder</DialogTitle>
          <DialogDescription>
            Manage study sets within your folder.
          </DialogDescription>
        </DialogHeader>
        <Link href="/create-set">
          <Button className="w-full">Create new study set</Button>
        </Link>
        {studySets?.length ? (
          <div className="flex flex-col gap-4">
            {studySets.map((set) => {
              const isIn = folder.studySets.some(({ id }) => id === set.id);

              return (
                <AddStudySetCard
                  key={set.id}
                  folderId={folder.id}
                  studySetId={set.id}
                  name={set.title}
                  isIn={isIn}
                  onMutate={() => onMutate(set, isIn)}
                  onSettled={onSettled}
                />
              );
            })}
          </div>
        ) : (
          <Empty message="You have no study sets yet" className="my-4" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FolderStudySetsDialog;
