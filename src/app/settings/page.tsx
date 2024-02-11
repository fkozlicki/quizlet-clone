import DeleteAccount from "@/components/settings/DeleteAccount";
import EditProfilePicture from "@/components/settings/EditProfilePicture";
import NightMode from "@/components/settings/NightMode";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { notFound, redirect } from "next/navigation";
import React from "react";

export default async function Settings() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <>
      <EditProfilePicture image={user.image} userId={user.id} />
      <NightMode />
      <DeleteAccount userName={user.name} image={user.image} />
    </>
  );
}
