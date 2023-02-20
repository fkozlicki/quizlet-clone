import {
  BellIcon,
  Cog6ToothIcon,
  FolderIcon,
  MoonIcon,
  Square2StackIcon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ProfileImage from "../ProfileImage";

interface MobileMenuProps {
  status: boolean;
  close: () => void;
}

const MobileMenu = ({ status, close }: MobileMenuProps) => {
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const toggleCreate = () => {
    setCreateOpen((prev) => !prev);
  };

  return (
    <div
      className={`fixed top-0 left-0 z-50 h-screen w-screen bg-white transition-transform md:hidden ${
        status ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-end px-4 py-2">
        <button
          onClick={close}
          className="rounded-full border p-2 hover:bg-slate-200"
        >
          <XMarkIcon className="w-6" />
        </button>
      </div>
      <div>
        <div>
          <div className="p-4 text-xl font-medium">Home</div>
          <div className="">
            <div onClick={toggleCreate} className="p-4 text-xl font-medium">
              Create
            </div>
            {createOpen && (
              <div className="mx-4 mb-4 overflow-hidden border-l transition-transform">
                <Link
                  href="/create-set"
                  className="group flex items-center gap-4 px-6 py-3 text-xl font-medium"
                >
                  <Square2StackIcon width={24} className="text-slate-500" />
                  <span className="group-hover:text-slate-500">Study set</span>
                </Link>
                <div className="group flex items-center gap-4 px-6 py-3 text-xl font-medium">
                  <FolderIcon width={24} className="text-slate-500" />
                  <span className="group-hover:text-slate-500">Folder</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="m-auto h-0.5 w-[95%] bg-slate-100"></div>
        {session && session.user && (
          <div className="px-6 py-8">
            <div className="mb-4 flex items-center gap-4">
              <ProfileImage
                image={session.user.image}
                userName={session.user.name}
                size={40}
                fontSize={20}
              />
              <div>
                <p className="text-xl font-bold">{session.user.name}</p>
                <p>{session.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-4 text-xl font-medium">
              <BellIcon width={24} />
              Notifications
              <span className="rounded bg-blue-700 px-2 text-sm font-normal text-white">
                soon
              </span>
            </div>
            <Link
              href={`/${session.user.id}`}
              className="flex gap-4 py-4 text-xl font-medium"
            >
              <UserCircleIcon width={24} />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex gap-4 py-4 text-xl font-medium"
            >
              <Cog6ToothIcon width={24} />
              Settings
            </Link>
            <button className="flex items-center gap-4 py-4 text-xl font-medium">
              <MoonIcon width={24} />
              Dark mode
              <span className="rounded bg-blue-700 px-2 text-sm font-normal text-white">
                soon
              </span>
            </button>
            <button
              onClick={() => signOut()}
              className="mt-4 w-full rounded-lg border py-2 text-center font-semibold text-gray-500 hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
