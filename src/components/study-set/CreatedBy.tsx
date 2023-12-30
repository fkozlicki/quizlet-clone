import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar, Typography } from "antd";
import Link from "next/link";

interface CreatedByProps {
  user: User;
}

const CreatedBy = ({ user }: CreatedByProps) => {
  return (
    <Link href={`/${user.id}`} className="flex items-center gap-4">
      <Avatar icon={<UserOutlined />} src={user.image} />
      <div className="flex flex-col">
        <Typography.Text className="text-xs font-semibold">
          Created by
        </Typography.Text>
        <Typography.Text className="text-sm font-medium">
          {user.name}
        </Typography.Text>
      </div>
    </Link>
  );
};

export default CreatedBy;
