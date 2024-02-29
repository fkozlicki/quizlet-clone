import FolderSkeleton from "@/components/folder/FolderSkeleton";
import React from "react";

const loading = () => {
  return (
    <div className="grid gap-y-4">
      <FolderSkeleton />
      <FolderSkeleton />
      <FolderSkeleton />
      <FolderSkeleton />
    </div>
  );
};

export default loading;
