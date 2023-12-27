import { UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Avatar, Tabs } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

interface ProfileLayoutProps {
  user: User;
  children: ReactElement;
}

const ProfileLayout = ({ children, user }: ProfileLayoutProps) => {
  const { data: session } = useSession();
  const { pathname } = useRouter();

  const { id, name, image } = user;

  return (
    <>
      <div className="mb-8 flex items-start gap-5">
        <Avatar
          icon={<UserOutlined />}
          src={image}
          alt=""
          className="h-16 w-16"
        />
        <div>
          <div className="text-2xl font-bold">{name}</div>
          <div className="font-semibold text-gray-400">{name}</div>
        </div>
      </div>
      <Tabs
        activeKey={
          pathname === "/[id]"
            ? "1"
            : pathname === "/[id]/study-sets"
            ? "2"
            : "3"
        }
        items={(session?.user.id === id
          ? [
              {
                key: "1",
                label: <Link href={`/${id}`}>Achivements</Link>,
              },
            ]
          : []
        ).concat([
          {
            key: "2",
            label: <Link href={`/${id}/study-sets`}>Study sets</Link>,
          },
          {
            key: "3",
            label: <Link href={`/${id}/folders`}>Folders</Link>,
          },
        ])}
      />
      <div className="py-4">{children}</div>
    </>
  );
};

export default ProfileLayout;
