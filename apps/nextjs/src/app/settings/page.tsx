import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import DarkMode from "~/components/settings/dark-mode";
import DeleteAccount from "~/components/settings/delete-account";
import EditProfilePicture from "~/components/settings/edit-profile-picture";

export const metadata: Metadata = {
  title: "Quizlet - Settings",
};

export default async function Settings() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <h2 className="mb-8 text-2xl font-bold">Settings</h2>
      <EditProfilePicture user={session.user} />
      <DarkMode />
      <DeleteAccount user={session.user} />
    </>
  );
}
