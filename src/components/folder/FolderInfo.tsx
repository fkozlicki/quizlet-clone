import { FolderOutlined } from "@ant-design/icons";
import type { Folder } from "@prisma/client";

interface FolderInfoProps {
  title: Folder["title"];
  description: Folder["description"];
}

const FolderInfo = ({ title, description }: FolderInfoProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <FolderOutlined className="text-5xl" />
        <div className="text-4xl font-bold">{title}</div>
      </div>
      {description && <div>{description}</div>}
    </div>
  );
};

export default FolderInfo;
