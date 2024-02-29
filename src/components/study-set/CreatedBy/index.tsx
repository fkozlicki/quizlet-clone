import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar } from "antd";
import Text from "antd/es/typography/Text";
import Image from "next/image";
import Link from "next/link";

interface CreatedByProps {
  user: Pick<User, "id" | "image" | "name">;
}

const CreatedBy = ({ user }: CreatedByProps) => {
  const { id, image, name } = user;

  return (
    <Link href={`/${id}`} className="flex items-center gap-4">
      <Avatar
        icon={<UserOutlined />}
        src={
          image ? (
            <Image src={image} alt="" width={30} height={30} />
          ) : undefined
        }
      />
      <div className="flex flex-col">
        <Text className="text-xs font-semibold">Created by</Text>
        <Text className="text-sm font-medium">{name}</Text>
      </div>
    </Link>
  );
};

export default CreatedBy;
