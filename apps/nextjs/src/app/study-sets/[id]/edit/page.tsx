import type { Metadata } from "next";

import StudySetForm from "~/components/study-set-form";
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

export default async function EditStudySet({
  params: { id },
}: EditStudySetProps) {
  const studySet = await api.studySet.byId({ id });

  return (
    <StudySetForm
      defaultValues={{
        ...studySet,
        description: studySet.description ?? undefined,
      }}
    />
  );
}
