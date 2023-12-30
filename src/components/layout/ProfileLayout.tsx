import { UserOutlined } from "@ant-design/icons";
import { Avatar, Tabs, Typography } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { api } from "../../utils/api";

interface ProfileLayoutProps {
  children: ReactElement;
  userId: string;
}

const ProfileLayout = ({ children, userId }: ProfileLayoutProps) => {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  const { data } = api.user.getById.useQuery({ id: userId });

  if (!data) {
    return <div>404</div>;
  }

  const { id, name, image } = data;

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
          <Typography.Text className="block text-2xl font-bold">
            {name}
          </Typography.Text>
          <Typography.Text className="block font-semibold" type="secondary">
            {name}
          </Typography.Text>
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
