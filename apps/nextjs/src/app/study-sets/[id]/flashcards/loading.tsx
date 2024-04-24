import React from "react";

import { Skeleton } from "@acme/ui/skeleton";

export default function loading() {
  return (
    <div className="m-auto max-w-5xl">
      <Skeleton className="h-[40rem] w-full" />
    </div>
  );
}
