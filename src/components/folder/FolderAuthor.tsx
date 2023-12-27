import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar } from "antd";
import Link from "next/link";

interface FolderInfoProps {
  setsCount: number;
  user: User;
}

const FolderAuthor = ({ setsCount, user }: FolderInfoProps) => {
  return (
    <div className="flex items-center gap-6">
      <div>{setsCount} sets</div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">created by</span>
        <Link href={`/${user.id}`} className="contents">
          <Avatar
            icon={<UserOutlined />}
            src={user.image}
            size="small"
            alt=""
          />
          <span className="text-sm font-medium">{user.name}</span>
        </Link>
      </div>
    </div>
  );
};

export default FolderAuthor;
