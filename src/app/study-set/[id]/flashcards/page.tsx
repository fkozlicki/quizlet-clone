import FlashcardsGame from "@/components/flashcards-mode/FlashcardsGame";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import React from "react";

export default async function Flashcards({
  params: { id },
}: {
  params: { id: string };
}) {
  const studySet = await api.studySet.getById.query({
    id,
  });

  if (!studySet) {
    notFound();
  }

  return (
    <div className="m-auto max-w-5xl">
      <FlashcardsGame
        setId={id}
        cards={studySet.cards}
        ownerId={studySet.userId}
        size="large"
      />
    </div>
  );
}
