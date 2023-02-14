import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../utils/api";

const Profile = () => {
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
      <div className="m-auto max-w-[75rem] py-4 md:px-4">
        <div className="mx-4 mb-8 flex items-center gap-5 sm:mx-10">
          {user?.image ? (
            <Image
              src={user.image}
              alt=""
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-400"></div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="font-semibold text-gray-400">{user?.name}</p>
          </div>
        </div>
        <div className="mb-8 border-b-2">
          {id && (
            <div className="mx-4 flex items-center gap-5 sm:mx-10">
              <Link
                href={`${id}`}
                className={`relative pb-1 before:absolute before:top-full before:left-0 ${
                  pathname === "/[id]" ? "before:block" : "before:hidden"
                } font-semibold before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block`}
              >
                Achivements
              </Link>
              <Link
                href={`${id}/study-sets`}
                className={`relative pb-1 before:absolute before:top-full before:left-0 ${
                  pathname === "/[id]/study-sets"
                    ? "before:block"
                    : "text-gray-500 before:hidden"
                } font-semibold before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block`}
              >
                Study sets
              </Link>
              <Link
                href={`${id}/solutions`}
                className={`relative pb-1 before:absolute before:top-full before:left-0 ${
                  pathname === "/[id]/solutions"
                    ? "before:block"
                    : "text-gray-500 before:hidden"
                } font-semibold before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block`}
              >
                Expert solutions
              </Link>
              <Link
                href={`${id}/courses`}
                className={`relative pb-1 before:absolute before:top-full before:left-0 ${
                  pathname === "/[id]/courses"
                    ? "before:block"
                    : "text-gray-500 before:hidden"
                } font-semibold before:h-0.5 before:w-full before:bg-blue-700 hover:text-black hover:before:block`}
              >
                Courses
              </Link>
            </div>
          )}
        </div>
        <div className="mx-4">
          <h2 className="mb-4 text-xl font-bold">Recent activity</h2>
          <div className="h-[400px] w-full rounded-2xl bg-white p-4 shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
