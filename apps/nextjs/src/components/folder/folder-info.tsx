"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Folder } from "lucide-react";

import { api } from "~/trpc/react";

const FolderInfo = () => {
  const { slug }: { slug: string } = useParams();
  const { data } = api.folder.bySlug.useQuery({ slug: slug });

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <Folder size={38} />
        <span className="mb-0 text-4xl font-bold">{data?.name}</span>
      </div>
      {data?.description && <p>{data.description}</p>}
    </div>
  );
};

export default FolderInfo;
