import type { Metadata } from "next";

import { auth } from "@acme/auth";

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

  await api.folder.allByUser.prefetch({ userId: id });

  const isOwner = session?.user.id === id;

  const title = `${isOwner ? "Your" : `${user.name}'s`} folders`;

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      <UserFolders userId={id} />
    </>
  );
}
