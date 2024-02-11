import StudySetPage from "@/components/StudySetPage";
import { createSSRHelper } from "@/server/helpers/ssgHelper";
import { dehydrate, Hydrate } from "@tanstack/react-query";
import React from "react";

export default async function StudySet({
  params: { id },
}: {
  params: { id: string };
}) {
  const helpers = await createSSRHelper();
  await helpers.studySet.getById.prefetch({ id });
  const dehydrateState = dehydrate(helpers.queryClient);

  return (
    <Hydrate state={dehydrateState}>
      <StudySetPage id={id} />
    </Hydrate>
  );
}
