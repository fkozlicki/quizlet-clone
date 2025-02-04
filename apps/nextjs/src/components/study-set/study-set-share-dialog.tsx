"use client";

import { Copy, Share } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";

import { getAppUrl } from "~/utils/get-url";

const StudySetShareDialog = ({ id }: { id: string }) => {
  const url = `${getAppUrl()}/study-sets/${id}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Copied");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Share size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input id="link" defaultValue={url} readOnly autoFocus={false} />
          <Button onClick={onCopy} type="submit" size="icon" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudySetShareDialog;
