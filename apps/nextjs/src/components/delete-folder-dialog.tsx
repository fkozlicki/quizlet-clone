"use client";

import { useRouter } from "next/navigation";
import { Trash2, Trash2Icon } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

const DeleteFolderDialog = ({ id, userId }: { id: string; userId: string }) => {
  const { mutate } = api.folder.delete.useMutation();
  const router = useRouter();

  const deleteFolder = () => {
    mutate(
      { id },
      {
        onSuccess() {
          toast.success("Successfully deleted folder");
          router.push(`/users/${userId}/folders`);
        },
        onError() {
          toast.error("Couldn't delete folder, try again");
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            folder and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button onClick={deleteFolder} variant="destructive">
            Delete <Trash2Icon size={16} className="ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFolderDialog;
