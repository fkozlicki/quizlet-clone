import { XMarkIcon } from "@heroicons/react/24/solid";
import type { User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma?.user.findUnique({
    where: {
      id: session.user?.id,
    },
  });

  return {
    props: {
      user,
    },
  };
};

const Settings: NextPage<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-slate-100">
      <div className="mx-4 max-w-screen-lg py-4 sm:mx-6 lg:m-auto">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:gap-8">
          <div className="mb-4 flex items-center gap-4 lg:basis-48 lg:flex-col">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-600 text-2xl text-white">
                {user.name?.charAt(0)}
              </div>
            )}
            <div className="text-xl font-semibold">Profile Picture</div>
          </div>
          <div className="flex-1 rounded-lg bg-white p-4 shadow">
            <div>Choose your profile picture</div>
            <div></div>
            <div className="mb-4 flex items-center">
              <div className="h-px flex-1 bg-gradient-to-l from-slate-300" />
              <div className="mx-2">or</div>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-300" />
            </div>
            <form>
              <button className="m-auto block rounded-md bg-cyan-400 px-4 py-2 font-medium text-white hover:bg-cyan-500">
                Upload your own photo
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
          <div className="mb-2 flex items-center gap-2 lg:basis-48 lg:flex-col lg:justify-center">
            <XMarkIcon width={32} height={32} />
            <p className="text-xl font-semibold">Delete Account</p>
          </div>
          <div className="flex-1 rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              Permanently delete {user.name}
            </h2>
            <p className="mb-8">
              Be careful - this will delete all your data and connot be undone.
            </p>
            <button className="rounded bg-red-400 px-4 py-2 font-medium text-white hover:bg-red-300">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
