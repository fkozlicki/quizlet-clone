"use client";

import React, { use } from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import StudySetCard from "./study-set-card";

const UserStudySets = ({
  promise,
  userId,
}: {
  userId: string;
  promise: Promise<RouterOutputs["studySet"]["allByUser"]>;
}) => {
  const initialData = use(promise);
  const { data: studySets } = api.studySet.allByUser.useQuery(
    { userId },
    {
      initialData,
    },
  );

  return (
    <>
      {studySets.map((set) => (
        <StudySetCard key={set.id} studySet={set} />
      ))}
    </>
  );
};

export default UserStudySets;
