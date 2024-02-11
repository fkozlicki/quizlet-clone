import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar } from "antd";
import Text from "antd/es/typography/Text";
import Link from "next/link";

interface CreatedByProps {
  user: User;
}

const CreatedBy = ({ user }: CreatedByProps) => {
  return (
    <Link href={`/${user.id}`} className="flex items-center gap-4">
      <Avatar icon={<UserOutlined />} src={user.image} />
      <div className="flex flex-col">
        <Text className="text-xs font-semibold">Created by</Text>
        <Text className="text-sm font-medium">{user.name}</Text>
      </div>
    </Link>
  );
};

export default CreatedBy;
