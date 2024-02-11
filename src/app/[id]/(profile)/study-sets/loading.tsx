import StudySetSkeleton from "@/components/shared/StudySetSkeleton";
import React from "react";

const loading = () => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      <StudySetSkeleton />
      <StudySetSkeleton />
      <StudySetSkeleton />
      <StudySetSkeleton />
    </div>
  );
};

export default loading;
