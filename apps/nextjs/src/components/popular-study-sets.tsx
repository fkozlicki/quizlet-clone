"use client";

import { use } from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import StudySetCard from "./study-set-card";

const PopularStudySets = ({
  promise,
}: {
  promise: Promise<RouterOutputs["studySet"]["popular"]>;
}) => {
  const initialData = use(promise);
  const { data: studySets } = api.studySet.popular.useQuery(undefined, {
    initialData,
  });

  return (
    <>
      {studySets.map((set) => (
        <StudySetCard key={set.id} studySet={set} />
      ))}
    </>
  );
};

export default PopularStudySets;
