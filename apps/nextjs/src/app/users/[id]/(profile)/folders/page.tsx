import type { Metadata } from "next";
import { Suspense } from "react";

import { auth } from "@acme/auth";

import FolderSkeletonGrid from "~/components/folder/folder-skeleton-grid";
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
      <Suspense fallback={<FolderSkeletonGrid />}>
        <UserFolders userId={id} promise={folders} />
      </Suspense>
    </>
  );
}
