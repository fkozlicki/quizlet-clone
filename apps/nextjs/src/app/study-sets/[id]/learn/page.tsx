import type { Metadata } from "next";
import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

import { appRouter } from "@acme/api";

import LearnMode from "~/components/learn-mode";
import { api, createContext } from "~/trpc/server";

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
  const helper = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
  await helper.studySet.learnCards.prefetch({ id });

  const state = dehydrate(helper.queryClient);

  return (
    <HydrationBoundary state={state}>
      <div className="m-auto max-w-3xl">
        <LearnMode />
      </div>
    </HydrationBoundary>
  );
}
