"use client";

import React from "react";
import { useParams } from "next/navigation";

import Empty from "@acme/ui/empty";

import { api } from "~/trpc/react";
import StudySetCard from "../shared/study-set-card";

const FolderStudySets = () => {
  const { slug }: { slug: string } = useParams();
  const [folder] = api.folder.bySlug.useSuspenseQuery({ slug });

  if (folder.studySets.length === 0) {
    return <Empty message="Folder is empty" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {folder.studySets.map((studySet) => (
        <StudySetCard key={studySet.id} studySet={studySet} />
      ))}
    </div>
  );
};

export default FolderStudySets;
