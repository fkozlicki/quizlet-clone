import { FolderIcon } from "@heroicons/react/24/outline";
import type { Folder } from "@prisma/client";
import React from "react";

interface FolderInfoProps {
  title: Folder["title"];
  description: Folder["description"];
}

const FolderInfo = ({ title, description }: FolderInfoProps) => {
  return (
    <div>
      <div className="flex items-end gap-4">
        <FolderIcon width={52} />
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
      {description && <div>{description}</div>}
    </div>
  );
};

export default FolderInfo;
