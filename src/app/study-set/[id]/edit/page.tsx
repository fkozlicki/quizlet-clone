import StudySetForm from "@/components/study-set/StudySetForm";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

export default async function EditStudySet({
  params: { id },
}: {
  params: { id: string };
}) {
  const studySet = await api.studySet.getById.query({
    id,
  });
  const session = await getServerAuthSession();

  if (!studySet) {
    notFound();
  }

  if (studySet.userId !== session?.user.id) {
    redirect(`/study-set/${studySet.id}`);
  }

  return <StudySetForm initialData={studySet} />;
}
