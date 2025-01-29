import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import UserStudySets from "~/components/user/user-study-sets";

export const metadata: Metadata = {
  title: "Quizlet - Latest",
};

export default async function Latest() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <UserStudySets userId={session.user.id} />;
}
