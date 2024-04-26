import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

import { appRouter } from "@acme/api";

import MatchGame from "~/components/match-mode/match-game";
import { api, createContext } from "~/trpc/server";

interface MatchModeProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: MatchModeProps): Promise<Metadata> {
  const studySet = await api.studySet.byId({ id });

  if (!studySet) {
    return {};
  }

  return {
    title: `${studySet.title} - Match`,
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
  const studySet = await api.studySet.byId({ id });
  const state = dehydrate(helper.queryClient);

  if (!studySet) {
    notFound();
  }

  return (
    <HydrationBoundary state={state}>
      <MatchGame />
    </HydrationBoundary>
  );
}
