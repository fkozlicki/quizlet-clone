import React from "react";

import { Skeleton } from "@acme/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-auto max-w-3xl">
      <Skeleton className="mb-1 h-8 w-64" />
      <Skeleton className="mb-4 h-4 w-full" />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
      <Skeleton className="mb-4 h-[400px] w-full" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
