"use client";

import { useRouter } from "next/navigation";

import type { Session } from "@acme/auth";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { useFolderDialogContext } from "~/contexts/folder-dialog-context";
import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";

const CreateOptionsDropdown = ({ session }: { session: Session | null }) => {
  const [, dispatch] = useFolderDialogContext();
  const { onOpenChange } = useSignInDialogContext();
  const router = useRouter();

  const openFolderDialog = () => {
    dispatch({ type: "open" });
  };

  const openSignInDialog = () => {
    onOpenChange(true);
  };

  const onFolderClick = () => {
    if (session) {
      openFolderDialog();
    } else {
      openSignInDialog();
    }
  };

  const onStudySetClick = () => {
    if (session) {
      router.push("/create-set");
    } else {
      openSignInDialog();
    }
  };

  return (
    <div className="hidden md:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Create</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onFolderClick}>Folder</DropdownMenuItem>
          <DropdownMenuItem onClick={onStudySetClick}>
            Study set
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CreateOptionsDropdown;
