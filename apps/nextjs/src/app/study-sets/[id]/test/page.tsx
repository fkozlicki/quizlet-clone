import type { Metadata } from "next";
import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

import { appRouter } from "@acme/api";

import TestMode from "~/components/test-mode/test-mode";
import { api, createContext } from "~/trpc/server";

interface TestModeProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: TestModeProps): Promise<Metadata> {
  const { title } = await api.studySet.byId({ id });

  return {
    title: `${title} - Test`,
  };
}

export default async function Test({
  params: { id },
}: {
  params: { id: string };
}) {
  const helper = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
  await helper.studySet.testCards.prefetch({ id });
  const state = dehydrate(helper.queryClient);

  return (
    <HydrationBoundary state={state}>
      <div className="m-auto max-w-3xl">
        <TestMode />
      </div>
    </HydrationBoundary>
  );
}
