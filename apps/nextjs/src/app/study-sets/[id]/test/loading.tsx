import React from "react";

import { Skeleton } from "@acme/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-auto max-w-3xl">
      <div className="space-y-8">
        <Skeleton className="h-[482px] w-full" />
        <Skeleton className="h-[482px] w-full" />
        <Skeleton className="h-[482px] w-full" />
      </div>
    </div>
  );
}
