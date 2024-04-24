import React from "react";
import { Trash2 } from "lucide-react";

import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";

const DeleteFolderDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="py-5">
          <div className="mb-4 flex items-center text-base">
            Are you sure you want to delete
            <Badge className="mx-2">folder_name</Badge>
            folder
          </div>
          <div>
            Deleting folder cannot be undone. Sets in this folder will not be
            deleted.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFolderDialog;
