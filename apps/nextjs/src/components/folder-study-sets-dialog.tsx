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

import { api } from "~/trpc/react";
import AddStudySetCard from "./add-study-set-card";

interface FolderStudySetsDialogProps {
  userId: string;
}

const FolderStudySetsDialog = ({ userId }: FolderStudySetsDialogProps) => {
  const { slug }: { slug: string } = useParams();
  const { data: studySets } = api.studySet.allByUser.useQuery({ userId });
  const { data: folder } = api.folder.bySlug.useQuery({ slug });

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
        <div className="flex flex-col gap-4">
          {studySets?.map((set) => (
            <AddStudySetCard
              studySetId={set.id}
              key={set.id}
              isIn={folder.studySets.some(({ id }) => id === set.id)}
              folderId={folder.id}
              revalidate="folder"
              name={set.title}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderStudySetsDialog;
