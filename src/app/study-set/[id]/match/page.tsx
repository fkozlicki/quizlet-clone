import MatchMode from "@/components/match-mode/MatchMode";
import { createSSRHelper } from "@/server/helpers/ssgHelper";
import { Hydrate, dehydrate } from "@tanstack/react-query";

export default async function Match({
  params: { id },
}: {
  params: { id: string };
}) {
  const helpers = await createSSRHelper();
  await helpers.studySet.getMatchCards.prefetch({ setId: id });
  const dehydrateState = dehydrate(helpers.queryClient);

  return (
    <Hydrate state={dehydrateState}>
      <MatchMode setId={id} />
    </Hydrate>
  );
}
