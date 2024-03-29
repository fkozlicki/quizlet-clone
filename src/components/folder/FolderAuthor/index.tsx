import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar } from "antd";
import Text from "antd/es/typography/Text";
import Link from "next/link";

interface FolderInfoProps {
  setsCount: number;
  user: Pick<User, "id" | "name" | "image">;
}

const FolderAuthor = ({ setsCount, user }: FolderInfoProps) => {
  return (
    <div className="flex items-center gap-6">
      <Text>{setsCount} sets</Text>
      <div className="flex items-center gap-2">
        <Text className="text-sm font-semibold" type="secondary">
          created by
        </Text>
        <Link href={`/${user.id}`} className="contents">
          <Avatar
            icon={<UserOutlined />}
            src={user.image}
            size="small"
            alt=""
          />
          <Text className="text-sm font-semibold" type="secondary">
            {user.name}
          </Text>
        </Link>
      </div>
    </div>
  );
};

export default FolderAuthor;
