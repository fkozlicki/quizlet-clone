"use client";

import { useRef, useState } from "react";
import {
  DownloadIcon,
  Ellipsis,
  MergeIcon,
  PrinterIcon,
  Trash2Icon,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { api } from "~/trpc/react";
import DeleteStudySetDialog from "./delete-study-set-dialog";
import StudySetCombineDialog from "./study-set-combine-dialog";
import StudySetExportDialog from "./study-set-export-dialog";
import StudySetToPrint from "./study-set-to-print";

const StudySetOptionsDropdown = ({
  isOwner,
  id,
  userId,
}: {
  isOwner: boolean;
  id: string;
  userId?: string;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [combineDialogOpen, setCombineDialogOpen] = useState<boolean>(false);
  const utils = api.useUtils();
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  const openCombineDialog = () => {
    setCombineDialogOpen(true);
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const openExportDialog = () => {
    setExportDialogOpen(true);
  };

  const studySet = utils.studySet.byId.getData({ id });

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
          {userId && (
            <DropdownMenuItem onClick={openCombineDialog}>
              <MergeIcon size={16} className="mr-2" />
              Combine
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handlePrint()}>
            <PrinterIcon size={16} className="mr-2" />
            Print
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openExportDialog}>
            <DownloadIcon size={16} className="mr-2" /> Export
          </DropdownMenuItem>
          {isOwner && (
            <DropdownMenuItem onClick={openDeleteDialog}>
              <Trash2Icon size={16} className="mr-2" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <StudySetExportDialog
        id={id}
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
      {userId && (
        <StudySetCombineDialog
          id={id}
          open={combineDialogOpen}
          onOpenChange={setCombineDialogOpen}
          userId={userId}
        />
      )}
      {isOwner && (
        <DeleteStudySetDialog
          id={id}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
      {studySet && <StudySetToPrint ref={contentRef} studySet={studySet} />}
    </>
  );
};

export default StudySetOptionsDropdown;
