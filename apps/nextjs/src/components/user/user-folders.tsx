"use client";

import React, { use } from "react";

import type { RouterOutputs } from "@acme/api";
import Empty from "@acme/ui/empty";

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

  return folders.length ? (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  ) : (
    <Empty message="You have no folders yet" />
  );
};

export default UserFolders;
