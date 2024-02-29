import { FolderOutlined } from "@ant-design/icons";
import type { Folder } from "@prisma/client";
import { Typography } from "antd";
const { Title, Text } = Typography;

interface FolderInfoProps {
  title: Folder["title"];
  description: Folder["description"];
}

const FolderInfo = ({ title, description }: FolderInfoProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <FolderOutlined className="text-5xl" />
        <Title className="mb-0 text-4xl font-bold">{title}</Title>
      </div>
      {description && <Text>{description}</Text>}
    </div>
  );
};

export default FolderInfo;
