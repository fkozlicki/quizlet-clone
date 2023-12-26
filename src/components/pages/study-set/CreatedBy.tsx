import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar } from "antd";
import Link from "next/link";

interface CreatedByProps {
  user: User;
}

const CreatedBy = ({ user }: CreatedByProps) => {
  return (
    <Link href={`/${user.id}`} className="flex items-center gap-4">
      <Avatar icon={<UserOutlined />} src={user.image} />
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">Created by</span>
        <span className="text-sm font-medium">{user.name}</span>
      </div>
    </Link>
  );
};

export default CreatedBy;
