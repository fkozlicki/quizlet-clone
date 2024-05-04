import type { Metadata } from "next";
import Link from "next/link";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

import { appRouter } from "@acme/api";
import { auth } from "@acme/auth";
import { Button } from "@acme/ui/button";

import FlashcardsGame from "~/components/flashcards-mode/flashcards-game";
import CreatedBy from "~/components/study-set/created-by";
import OtherStudySets from "~/components/study-set/other-study-sets";
import StudyModes from "~/components/study-set/study-modes";
import StudySetCTA from "~/components/study-set/study-set-cta";
import StudySetFlashcards from "~/components/study-set/study-set-flashcards";
import StudySetInfo from "~/components/study-set/study-set-info";
import { api, createContext } from "~/trpc/server";

interface StudySetProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: StudySetProps): Promise<Metadata> {
  const { title } = await api.studySet.byId({ id });

  return {
    title,
  };
}

export default async function StudySet({ params: { id } }: StudySetProps) {
  const session = await auth();
  const helper = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
  await helper.studySet.byId.prefetch({ id });

  if (session) {
    await helper.folder.allByUser.prefetch({ userId: session.user.id });
    await helper.studySet.allByUser.prefetch({ userId: session.user.id });
  }

  const state = dehydrate(helper.queryClient);

  const { userId, user } = await api.studySet.byId({ id });

  return (
    <HydrationBoundary state={state}>
      <div className="m-auto max-w-3xl">
        <StudySetInfo />
        <StudyModes studySetId={id} />
        <FlashcardsGame session={session} />
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CreatedBy user={user} />
          <StudySetCTA session={session} userId={userId} id={id} />
        </div>
        <StudySetFlashcards session={session} />
        {userId === session?.user.id && (
          <Link href={`/study-sets/${id}/edit`}>
            <Button size="lg" className="m-auto mb-8 block">
              Add or Remove Terms
            </Button>
          </Link>
        )}
        {user.studySets.length > 0 && (
          <OtherStudySets studySets={user.studySets} />
        )}
      </div>
    </HydrationBoundary>
  );
}
