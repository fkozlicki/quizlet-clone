"use client";

import React from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import StudySetForm from "./study-set-form";

const EditStudySet = ({
  studySet,
}: {
  studySet: RouterOutputs["studySet"]["byId"];
}) => {
  const { data } = api.studySet.byId.useQuery(
    { id: studySet.id },
    { initialData: studySet },
  );

  return (
    <StudySetForm
      defaultValues={{
        ...data,
        description: data.description ?? undefined,
      }}
    />
  );
};

export default EditStudySet;
