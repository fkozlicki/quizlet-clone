"use clinet";

import React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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

import { api } from "~/trpc/react";

interface DeleteStudySetDialogProps {
  id: string;
  name: string;
}

const DeleteStudySetDialog = ({ id, name }: DeleteStudySetDialogProps) => {
  const utils = api.useUtils();
  const router = useRouter();
  const { mutate } = api.studySet.delete.useMutation({
    async onSuccess() {
      await utils.studySet.invalidate();
      router.push("/latest");
    },
  });

  const handleDelete = () => {
    mutate({ id });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {name}</DialogTitle>
          <DialogDescription>
            Deleting study set will remove all flashcards in this study set.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div>Are you sure you want to delete ... study set</div>
          <div>
            Deleting study set will remove all flashcards in this study set.
            This action cannot be undone.
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDelete} variant="destructive" type="submit">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudySetDialog;
