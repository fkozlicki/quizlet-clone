import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { auth } from "@acme/auth";

import ProfileLayout from "~/components/user/profile-layout";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
  params: { id },
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const session = await auth();

  try {
    const user = await api.user.byId({ id });

    return (
      <ProfileLayout user={user} session={session}>
        {children}
      </ProfileLayout>
    );
  } catch {
    notFound();
  }
}
