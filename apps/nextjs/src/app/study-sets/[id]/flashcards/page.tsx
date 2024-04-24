import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

import { appRouter } from "@acme/api";
import { auth } from "@acme/auth";

import FlashcardsGame from "~/components/flashcards-game";
import { api, createContext } from "~/trpc/server";

interface FlashcardsModeProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: FlashcardsModeProps): Promise<Metadata> {
  const { title } = await api.studySet.byId({ id });

  return {
    title: `${title} - Flashcards`,
  };
}

export default async function FlashcardsMode({
  params: { id },
}: FlashcardsModeProps) {
  const helper = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
  await helper.studySet.byId.prefetch({ id });
  const state = dehydrate(helper.queryClient);
  const session = await auth();

  return (
    <HydrationBoundary state={state}>
      <div className="m-auto max-w-5xl">
        <FlashcardsGame fullscreen session={session} />
      </div>
    </HydrationBoundary>
  );
}
