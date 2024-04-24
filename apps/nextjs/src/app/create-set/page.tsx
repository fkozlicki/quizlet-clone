import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import StudySetForm from "~/components/study-set-form";

export const metadata: Metadata = {
  title: "Create study set",
};

export default async function CreateSet() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <StudySetForm />;
}
