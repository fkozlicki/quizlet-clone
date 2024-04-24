"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import FolderDialog from "./folder-dialog";

const CreateOptionsDropdown = () => {
  const [folderOpen, setFolderOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Create</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setFolderOpen(true)}>
            Folder
          </DropdownMenuItem>
          <Link href="/create-set">
            <DropdownMenuItem>Study set</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <FolderDialog open={folderOpen} onOpenChange={setFolderOpen} />
    </>
  );
};

export default CreateOptionsDropdown;
