import type { Metadata } from "next";

import { auth } from "@acme/auth";

import FlashcardsGame from "~/components/flashcards-mode/flashcards-game";
import FlashcardsModeProvider from "~/contexts/flashcards-mode-context";
import { api, HydrateClient } from "~/trpc/server";

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
  await api.studySet.byId.prefetch({ id });
  const session = await auth();

  return (
    <HydrateClient>
      <FlashcardsModeProvider id={id}>
        <div className="m-auto max-w-5xl">
          <FlashcardsGame fullscreen session={session} />
        </div>
      </FlashcardsModeProvider>
    </HydrateClient>
  );
}
