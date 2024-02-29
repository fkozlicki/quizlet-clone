import StudySet from "@/components/study-set/StudySet";
import { createSSRHelper } from "@/server/helpers/ssgHelper";
import { dehydrate, Hydrate } from "@tanstack/react-query";
import React from "react";

export default async function StudySetPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const helpers = await createSSRHelper();
  await helpers.studySet.getById.prefetch({ id });
  const dehydrateState = dehydrate(helpers.queryClient);

  return (
    <Hydrate state={dehydrateState}>
      <StudySet id={id} />
    </Hydrate>
  );
}
