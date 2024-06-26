"use client";

import React from "react";
import { useParams } from "next/navigation";

import Empty from "@acme/ui/empty";

import { api } from "~/trpc/react";
import StudySetCard from "../shared/study-set-card";

const FolderStudySets = () => {
  const { slug }: { slug: string } = useParams();
  const { data } = api.folder.bySlug.useQuery({ slug });

  if (!data) {
    return null;
  }

  if (data.studySets.length === 0) {
    return <Empty message="Folder is empty" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.studySets.map((studySet) => (
        <StudySetCard key={studySet.id} studySet={studySet} />
      ))}
    </div>
  );
};

export default FolderStudySets;
