import ProfileLayout from "@/components/layout/ProfileLayout";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { type ReactNode } from "react";

export default async function Layout({
  children,
  params: { id },
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const user = await api.user.getById.query({ id });
  const session = await getServerAuthSession();

  if (!user) {
    notFound();
  }

  return (
    <ProfileLayout user={user} session={session}>
      {children}
    </ProfileLayout>
  );
}
