import LearnGame from "@/components/LearnGame";
import { api } from "@/trpc/server";
import React from "react";

export default async function Learn({
  params: { id },
}: {
  params: { id: string };
}) {
  const cards = await api.studySet.getLearnSet.query({
    id,
  });
  const starredCards = await api.starredFlashcard.getSetCards.query({
    setId: id,
  });

  return (
    <LearnGame cards={cards} starredFlashcards={starredCards} setId={id} />
  );
}
