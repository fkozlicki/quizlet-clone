import StudySet from "@/components/study-set/StudySet";
import { api } from "@/trpc/server";

export default async function StudySetPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await api.studySet.getById.query({
    id,
  });

  return <StudySet initialData={data} />;
}
