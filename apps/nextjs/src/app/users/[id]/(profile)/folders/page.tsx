import type { Metadata } from "next";
import { Suspense } from "react";

import { auth } from "@acme/auth";

import FolderSkeleton from "~/components/folder/folder-skeleton";
import UserFolders from "~/components/user/user-folders";
import { api } from "~/trpc/server";

interface UserFoldersProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: UserFoldersProps): Promise<Metadata> {
  const { name } = await api.user.byId({ id });

  return {
    title: `${name}'s folders`,
  };
}

export default async function Page({ params: { id } }: UserFoldersProps) {
  const session = await auth();
  const user = await api.user.byId({ id });

  const folders = api.folder.allByUser({ userId: id });

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        {session?.user.id === id ? "Your" : `${user.name}'s`} folders
      </h1>
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <FolderSkeleton />
            <FolderSkeleton />
            <FolderSkeleton />
            <FolderSkeleton />
          </div>
        }
      >
        <UserFolders userId={id} promise={folders} />
      </Suspense>
    </>
  );
}
