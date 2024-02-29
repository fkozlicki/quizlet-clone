"use client";

import { theme } from "antd";
import SkeletonInput from "antd/es/skeleton/Input";

const FolderSkeleton = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div
      style={{ background: colorBgContainer }}
      className="flex w-full flex-col gap-4 rounded px-6 py-2 shadow-md"
    >
      <SkeletonInput className="h-4 " />
      <SkeletonInput className="h-6 " />
    </div>
  );
};

export default FolderSkeleton;
