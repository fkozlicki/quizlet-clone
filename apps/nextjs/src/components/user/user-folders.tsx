"use client";

import React, { use } from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import FolderCard from "../folder/folder-card";

const UserFolders = ({
  userId,
  promise,
}: {
  userId: string;
  promise: Promise<RouterOutputs["folder"]["allByUser"]>;
}) => {
  const initialData = use(promise);
  const { data: folders } = api.folder.allByUser.useQuery(
    {
      userId,
    },
    { initialData },
  );

  return (
    <>
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </>
  );
};

export default UserFolders;
