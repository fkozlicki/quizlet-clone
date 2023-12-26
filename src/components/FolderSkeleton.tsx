import { Skeleton } from "antd";
import React from "react";

const FolderSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded bg-white px-6 py-2 shadow-md">
      <Skeleton.Input className="h-4 " />
      <Skeleton.Input className="h-6 " />
    </div>
  );
};

export default FolderSkeleton;
