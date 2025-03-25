import type { Metadata } from "next";

import { auth } from "@acme/auth";

import UserStudySets from "~/components/user/user-study-sets";
import { api } from "~/trpc/server";

interface UserStudySetsProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: UserStudySetsProps): Promise<Metadata> {
  const { name } = await api.user.byId({ id });

  return {
    title: `${name}'s study sets`,
  };
}

export default async function Page({ params: { id } }: UserStudySetsProps) {
  const session = await auth();
  const user = await api.user.byId({ id });

  const isOwner = session?.user.id === id;

  const title = `${isOwner ? "Your" : `${user.name}'s`} study sets`;

  return <UserStudySets userId={user.id} title={title} />;
}
