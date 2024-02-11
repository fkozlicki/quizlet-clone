import ProfileLayout from "@/components/layout/ProfileLayout";
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

  if (!user) {
    notFound();
  }

  return <ProfileLayout user={user}>{children}</ProfileLayout>;
}
