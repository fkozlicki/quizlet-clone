"use client";

import Empty from "@acme/ui/empty";

import { api } from "~/trpc/react";
import FolderCard from "../folder/folder-card";

const UserFolders = ({ userId }: { userId: string }) => {
  const [folders] = api.folder.allByUser.useSuspenseQuery({
    userId,
  });

  return folders.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  ) : (
    <Empty message="No folders yet." />
  );
};

export default UserFolders;
