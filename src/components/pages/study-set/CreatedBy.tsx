import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar } from "antd";

interface CreatedByProps {
  userImage: User["image"];
  userName: User["name"];
}

const CreatedBy = ({ userImage, userName }: CreatedByProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar icon={<UserOutlined />} src={userImage} />
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">Created by</span>
        <span className="text-sm font-medium">{userName}</span>
      </div>
    </div>
  );
};

export default CreatedBy;
