import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import StudySetForm from "~/components/study-set/study-set-form";
import { api } from "~/trpc/server";

interface EditStudySetProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: EditStudySetProps): Promise<Metadata> {
  const { title } = await api.studySet.byId({ id });

  return {
    title: `${title} - Edit`,
  };
}

export default async function Page({ params: { id } }: EditStudySetProps) {
  const session = await auth();
  const studySet = await api.studySet.byId({ id });

  if (!session || session.user.id !== studySet.userId) {
    redirect(`/study-sets/${studySet.id}`);
  }

  return <StudySetForm defaultValues={studySet} />;
}
