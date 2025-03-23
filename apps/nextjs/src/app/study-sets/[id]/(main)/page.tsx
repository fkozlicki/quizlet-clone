import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@acme/auth";
import { Button } from "@acme/ui/button";

import FlashcardsGame from "~/components/flashcards-mode/flashcards-game";
import CreatedBy from "~/components/study-set/created-by";
import OtherStudySets from "~/components/study-set/other-study-sets";
import StudyModes from "~/components/study-set/study-modes";
import StudySetCTA from "~/components/study-set/study-set-cta";
import StudySetFlashcards from "~/components/study-set/study-set-flashcards";
import StudySetInfo from "~/components/study-set/study-set-info";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-cache";

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
  const { userId, user } = await api.studySet.byId({ id });
  const otherStudySets = await api.studySet.other({
    studySetId: id,
    userId: user.id,
  });

  await api.studySet.byId.prefetch({ id });

  const session = await auth();

  if (session) {
    await api.folder.allByUser.prefetch({ userId: session.user.id });
    await api.studySet.allByUser.prefetch({ userId: session.user.id });
  }

  return (
    <HydrateClient>
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
        {otherStudySets.length > 0 && (
          <OtherStudySets studySets={otherStudySets} />
        )}
      </div>
    </HydrateClient>
  );
}
