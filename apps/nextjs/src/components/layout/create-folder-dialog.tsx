"use client";

import React from "react";

import { useFolderDialogContext } from "~/contexts/folder-dialog-context";
import FolderDialog from "../folder/folder-dialog";

const CreateFolderDialog = () => {
  const [{ open }, dispatch] = useFolderDialogContext();

  const onOpenChange = (value: boolean) => {
    dispatch({ type: value ? "open" : "close" });
  };

  return <FolderDialog open={open} onOpenChange={onOpenChange} />;
};

export default CreateFolderDialog;
