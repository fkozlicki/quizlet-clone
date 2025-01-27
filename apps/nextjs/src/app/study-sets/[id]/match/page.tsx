import type { Metadata } from "next";

import MatchGame from "~/components/match-mode/match-game";
import { api, HydrateClient } from "~/trpc/server";

interface MatchModeProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: MatchModeProps): Promise<Metadata> {
  const { title } = await api.studySet.byId({ id });

  return {
    title: `${title} - Match`,
  };
}

export default async function MatchMode({
  params: { id },
}: {
  params: { id: string };
}) {
  await api.studySet.matchCards.prefetch({ id });

  return (
    <HydrateClient>
      <MatchGame />
    </HydrateClient>
  );
}
