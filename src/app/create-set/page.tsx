import StudySetForm from "@/components/study-set/StudySetForm";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function CreateSet() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  return <StudySetForm />;
}
