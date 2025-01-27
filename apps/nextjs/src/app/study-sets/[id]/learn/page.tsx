import type { Metadata } from "next";

import { auth } from "@acme/auth";

import LearnMode from "~/components/learn-mode/learn-mode";
import { api, HydrateClient } from "~/trpc/server";

interface LearnModeProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: LearnModeProps): Promise<Metadata> {
  const { title } = await api.studySet.byId({ id });

  return {
    title: `${title} - Learn`,
  };
}

export default async function Learn({
  params: { id },
}: {
  params: { id: string };
}) {
  await api.studySet.learnCards.prefetch({ id });
  const session = await auth();

  return (
    <HydrateClient>
      <div className="m-auto max-w-3xl">
        <LearnMode session={session} />
      </div>
    </HydrateClient>
  );
}
