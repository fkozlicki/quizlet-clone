import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

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
  const user = await api.user.byId({ id });

  if (!user) {
    return {};
  }

  return {
    title: `${user.name}'s folders`,
  };
}

export default async function Page({ params: { id } }: UserFoldersProps) {
  const user = await api.user.byId({ id });

  if (!user) {
    notFound();
  }

  const session = await auth();
  const folders = api.folder.allByUser({ userId: id });

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        {session?.user.id === id ? "Your" : `${user.name}'s`} folders
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Suspense
          fallback={
            <>
              <FolderSkeleton />
              <FolderSkeleton />
              <FolderSkeleton />
              <FolderSkeleton />
            </>
          }
        >
          <UserFolders userId={id} promise={folders} />
        </Suspense>
      </div>
    </>
  );
}
