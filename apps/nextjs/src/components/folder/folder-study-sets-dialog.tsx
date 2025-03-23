"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

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
import FolderStudySetCard from "./folder-study-set-card";

interface FolderStudySetsDialogProps {
  userId: string;
}

const FolderStudySetsDialog = ({ userId }: FolderStudySetsDialogProps) => {
  const { slug }: { slug: string } = useParams();
  const [studySets] = api.studySet.allByUser.useSuspenseQuery({ userId });
  const [folder] = api.folder.bySlug.useSuspenseQuery({ slug });

  const allStudySets = [
    ...folder.studySets,
    ...studySets.filter(
      (set) => !folder.studySets.some((folderSet) => folderSet.id === set.id),
    ),
  ];

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

        {allStudySets.length > 0 ? (
          <div className="flex flex-col gap-4">
            {allStudySets.map((set) => (
              <FolderStudySetCard
                key={set.id}
                folderId={folder.id}
                isIn={folder.studySets.some(({ id }) => id === set.id)}
                studySet={set}
              />
            ))}
          </div>
        ) : (
          <Empty message="You have no study sets yet" className="my-4" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FolderStudySetsDialog;
