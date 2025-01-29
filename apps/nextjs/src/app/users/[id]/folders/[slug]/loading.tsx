import { Skeleton } from "@acme/ui/skeleton";

import StudySetSkeletonGrid from "~/components/shared/study-set-skeleton-grid";

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-4 h-4 w-64" />
      <Skeleton className="mb-8 h-8 w-48" />
      <h2 className="mb-4 text-2xl font-bold">Study sets</h2>
      <StudySetSkeletonGrid />
    </>
  );
}
