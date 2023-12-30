import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar, Typography } from "antd";
import Link from "next/link";

interface FolderInfoProps {
  setsCount: number;
  user: User;
}

const FolderAuthor = ({ setsCount, user }: FolderInfoProps) => {
  return (
    <div className="flex items-center gap-6">
      <Typography.Text>{setsCount} sets</Typography.Text>
      <div className="flex items-center gap-2">
        <Typography.Text className="text-sm font-semibold" type="secondary">
          created by
        </Typography.Text>
        <Link href={`/${user.id}`} className="contents">
          <Avatar
            icon={<UserOutlined />}
            src={user.image}
            size="small"
            alt=""
          />
          <Typography.Text className="text-sm font-semibold" type="secondary">
            {user.name}
          </Typography.Text>
        </Link>
      </div>
    </div>
  );
};

export default FolderAuthor;
