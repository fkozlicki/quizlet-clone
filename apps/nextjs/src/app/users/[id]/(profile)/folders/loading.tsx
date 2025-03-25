import { Skeleton } from "@acme/ui/skeleton";

import FolderSkeletonGrid from "~/components/folder/folder-skeleton-grid";

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-6 h-8 w-[300px]" />
      <FolderSkeletonGrid />
    </>
  );
}
