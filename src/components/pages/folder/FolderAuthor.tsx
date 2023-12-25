import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar } from "antd";

interface FolderInfoProps {
  setsCount: number;
  userImage: User["image"];
  userName: User["name"];
}

const FolderAuthor = ({ setsCount, userImage, userName }: FolderInfoProps) => {
  return (
    <div className="flex items-center gap-6">
      <div>{setsCount} sets</div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">created by</span>
        <Avatar icon={<UserOutlined />} src={userImage} size="small" alt="" />
        <span className="text-sm font-medium">{userName}</span>
      </div>
    </div>
  );
};

export default FolderAuthor;
