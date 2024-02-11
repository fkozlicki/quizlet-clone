import MatchGame from "@/components/MatchGame";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import React from "react";

export default async function Match({
  params: { id },
}: {
  params: { id: string };
}) {
  const cards = await api.studySet.getMatchCards.query({ setId: id });

  if (!cards) {
    notFound();
  }

  return <MatchGame cards={cards} setId={id} />;
}
