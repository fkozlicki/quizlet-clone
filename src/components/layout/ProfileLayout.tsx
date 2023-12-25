import { UserOutlined } from "@ant-design/icons";
import { Avatar, Tabs } from "antd";
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
  const {
    data: user,
    isLoading,
    isError,
  } = api.user.getById.useQuery(
    {
      id: query.id as string,
    },
    {
      enabled: !!query.id,
    }
  );

  if (isError || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-slate-100">
      <div className="m-auto max-w-[75rem] p-4 sm:px-8">
        <div className="mb-8 flex items-start gap-5">
          <Avatar
            icon={<UserOutlined />}
            src={user.image}
            alt=""
            className="h-16 w-16"
          />
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
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
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
