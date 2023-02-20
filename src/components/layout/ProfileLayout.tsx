import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import React from "react";
import { api } from "../../utils/api";
import ProfileImage from "../ProfileImage";

interface ProfileLayoutProps {
  children: ReactElement;
  achivements: boolean;
}

const ProfileLayout = ({ children, achivements }: ProfileLayoutProps) => {
  const { query, pathname } = useRouter();
  const id = query.id?.toString();
  const { data: user } = api.user.getById.useQuery(
    {
      id: query.id as string,
    },
    {
      enabled: !!query.id,
    }
  );

  return (
    <div className="bg-slate-100">
      <div className="m-auto max-w-[75rem] p-4 sm:px-8">
        <div className="mb-8 flex items-center gap-5">
          <ProfileImage
            image={user?.image}
            userName={user?.name}
            size={64}
            fontSize={32}
          />
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="font-semibold text-gray-400">{user?.name}</p>
          </div>
        </div>
        <div className="mb-8 border-b-2">
          {id && (
            <div className="flex items-center gap-5">
              {achivements && (
                <Link
                  href={`/${id}`}
                  className={`relative pb-1 before:absolute before:top-full before:left-0 ${
                    pathname === "/[id]" ? "before:block" : "before:hidden"
                  } font-semibold before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block`}
                >
                  Achivements
                </Link>
              )}
              <Link
                href={`/${id}/study-sets`}
                className={`relative pb-1 before:absolute before:top-full before:left-0 ${
                  pathname === "/[id]/study-sets"
                    ? "before:block"
                    : "text-gray-500 before:hidden"
                } font-semibold before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block`}
              >
                Study sets
              </Link>
              <Link
                href={`/${id}/folders`}
                className={`relative pb-1 before:absolute before:top-full before:left-0 ${
                  pathname === "/[id]/folders"
                    ? "before:block"
                    : "text-gray-500 before:hidden"
                } font-semibold before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block`}
              >
                Folders
              </Link>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
