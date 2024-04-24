import type { Metadata } from "next";
import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

import { appRouter } from "@acme/api";

import MatchGame from "~/components/match-game";
import { api, createContext } from "~/trpc/server";

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
  const helper = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
  await helper.studySet.matchCards.prefetch({ id });
  const state = dehydrate(helper.queryClient);

  return (
    <HydrationBoundary state={state}>
      <MatchGame />
    </HydrationBoundary>
  );
}
