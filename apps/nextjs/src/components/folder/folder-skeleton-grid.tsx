import React from "react";

import { Card, CardContent } from "@acme/ui/card";
import { Skeleton } from "@acme/ui/skeleton";

const FolderSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="mb-4 h-5 w-16" />
        <Skeleton className="h-6 w-48" />
      </CardContent>
    </Card>
  );
};

const FolderSkeletonGrid = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <FolderSkeleton />
      <FolderSkeleton />
      <FolderSkeleton />
      <FolderSkeleton />
    </div>
  );
};

export default FolderSkeletonGrid;
