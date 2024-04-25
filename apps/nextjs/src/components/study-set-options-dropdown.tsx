"use client";

import { useState } from "react";
import {
  DownloadIcon,
  Ellipsis,
  MergeIcon,
  PrinterIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import DeleteStudySetDialog from "./delete-study-set-dialog";

const StudySetOptionsDropdown = ({
  isOwner,
  id,
}: {
  isOwner: boolean;
  id: string;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Ellipsis size={16} />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>More</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isOwner && (
            <DropdownMenuItem>
              <MergeIcon size={16} className="mr-2" />
              Combine
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <PrinterIcon size={16} className="mr-2" />
            Print
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon size={16} className="mr-2" /> Export
          </DropdownMenuItem>
          {isOwner && (
            <DropdownMenuItem onClick={openDeleteDialog}>
              <Trash2Icon size={16} className="mr-2" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {isOwner && (
        <DeleteStudySetDialog
          id={id}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </>
  );
};

export default StudySetOptionsDropdown;
