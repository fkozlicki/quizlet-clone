import { UserOutlined } from "@ant-design/icons";
import { Avatar, Skeleton, Tabs } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { api } from "../../utils/api";

interface ProfileLayoutProps {
  children: ReactElement;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  const { data: session } = useSession();
  const { query, pathname } = useRouter();
  const id = query.id as string;
  const { data: user, isLoading } = api.user.getById.useQuery(
    {
      id: query.id as string,
    },
    {
      enabled: !!query.id,
    }
  );

  if (isLoading) {
    return (
      <>
        <div className="mb-8 flex items-center gap-8">
          <Skeleton.Avatar
            size="large"
            className="[&>span]:h-16 [&>span]:w-16"
          />
          <div className="flex flex-col gap-2">
            <Skeleton.Input />
            <Skeleton.Input className="h-4" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
        </div>
      </>
    );
  }

  if (!user) {
    return <div>404</div>;
  }

  return (
    <>
      <div className="mb-8 flex items-start gap-5">
        <Avatar
          icon={<UserOutlined />}
          src={user.image}
          alt=""
          className="h-16 w-16"
        />
        <div>
          <div className="text-2xl font-bold">{user?.name}</div>
          <div className="font-semibold text-gray-400">{user?.name}</div>
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
