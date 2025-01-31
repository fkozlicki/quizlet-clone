"use client";

import { Suspense } from "react";

import Empty from "@acme/ui/empty";

import { api } from "~/trpc/react";
import StudySetCard from "../shared/study-set-card";
import StudySetSkeletonGrid from "../shared/study-set-skeleton-grid";

const UserStudySetsGrid = ({ userId }: { userId: string }) => {
  const [studySets] = api.studySet.allByUser.useSuspenseQuery({
    userId,
    limit: 6,
  });

  if (studySets.length === 0) {
    return <Empty message="You have no study sets yet" />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {studySets.map((set) => (
        <StudySetCard key={set.id} studySet={set} />
      ))}
    </div>
  );
};

const UserStudySets = ({
  userId,
  title = "Your study sets",
}: {
  userId: string;
  title?: string;
}) => {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      <Suspense fallback={<StudySetSkeletonGrid />}>
        <UserStudySetsGrid userId={userId} />
      </Suspense>
    </>
  );
};

export default UserStudySets;
