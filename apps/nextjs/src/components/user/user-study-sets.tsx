"use client";

import React, { use } from "react";

import type { RouterOutputs } from "@acme/api";
import Empty from "@acme/ui/empty";

import { api } from "~/trpc/react";
import StudySetCard from "../shared/study-set-card";

const UserStudySets = ({
  promise,
  userId,
}: {
  userId: string;
  promise: Promise<RouterOutputs["studySet"]["allByUser"]>;
}) => {
  const initialData = use(promise);
  const { data: studySets } = api.studySet.allByUser.useQuery(
    { userId, limit: 6 },
    {
      initialData,
    },
  );

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

export default UserStudySets;
