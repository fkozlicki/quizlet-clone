"use client";

import { api } from "@/trpc/react";
import React from "react";
import FolderPreview from "./FolderPreview";
import { notFound } from "next/navigation";
import FoldersEmpty from "./FoldersEmpty";

const UserFolders = ({ id }: { id: string }) => {
  const { data: folders } = api.folder.getAll.useQuery({
    userId: id,
  });

  if (!folders) {
    notFound();
  }

  return (
    <>
      {folders.length > 0 ? (
        <div className="grid gap-y-4">
          {folders.map(({ title, slug, studySets }, index) => (
            <FolderPreview
              key={index}
              title={title}
              setsCount={studySets.length}
              href={`/${id}/folders/${slug}`}
            />
          ))}
        </div>
      ) : (
        <FoldersEmpty userId={id} />
      )}
    </>
  );
};

export default UserFolders;
