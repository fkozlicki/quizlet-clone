"use client";

import React from "react";
import { useParams } from "next/navigation";

import { api } from "~/trpc/react";

const StudySetInfo = () => {
  const { id }: { id: string } = useParams();
  const { data } = api.studySet.byId.useQuery({ id });

  if (!data) {
    return null;
  }

  const { title, description } = data;

  return (
    <div className="mb-4">
      <h1 className="mb-0 text-2xl font-bold sm:text-3xl">{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};

export default StudySetInfo;
