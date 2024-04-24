import React from "react";

import { Card, CardContent } from "@acme/ui/card";
import { Skeleton } from "@acme/ui/skeleton";

const StudySetSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-5">
        <Skeleton className="mb-4 h-[21px] w-32" />
        <Skeleton className="h-[22px] w-20" />
        <div className="mt-10 flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudySetSkeleton;
