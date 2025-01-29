"use client";

import { Suspense } from "react";

import Empty from "@acme/ui/empty";

import { api } from "~/trpc/react";
import StudySetCard from "../shared/study-set-card";
import StudySetSkeletonGrid from "../shared/study-set-skeleton-grid";

const PopularStudySetsGrid = () => {
  const [studySets] = api.studySet.popular.useSuspenseQuery();

  if (studySets.length === 0) {
    return <Empty message="No popular study sets yet." />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {studySets.map((set) => (
        <StudySetCard key={set.id} studySet={set} />
      ))}
    </div>
  );
};

const PopularStudySets = () => {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">Popular study sets</h2>
      <Suspense fallback={<StudySetSkeletonGrid />}>
        <PopularStudySetsGrid />
      </Suspense>
    </>
  );
};

export default PopularStudySets;
