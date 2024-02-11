import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { notFound } from "next/navigation";
import React from "react";
import StudyModes from "@/components/study-set/StudyModes";
import FlashcardsGame from "@/components/flashcards-mode/FlashcardsGame";
import CreatedBy from "@/components/study-set/CreatedBy";
import StudySetCTA from "@/components/study-set/StudySetCTA";
import FlashcardsList from "@/components/study-set/FlashcardsList";
import Link from "next/link";
import { Button } from "antd";
import OtherSets from "@/components/study-set/OtherSets";

export default async function StudySet({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();
  const studySet = await api.studySet.getById.query({
    id,
  });

  if (!studySet) {
    notFound();
  }

  const { title, cards, userId, user, description } = studySet;
  const { studySets: otherSets } = user;

  return (
    <div className="m-auto max-w-3xl">
      <div className="mb-4">
        <Title className="mb-0 text-2xl font-bold sm:text-3xl">{title}</Title>
        {description && <Text className="text-base">{description}</Text>}
      </div>
      <StudyModes setId={id} />
      <FlashcardsGame setId={id} cards={cards} ownerId={userId} />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CreatedBy user={user} />
        <StudySetCTA studySetName={title} userId={userId} setId={id} />
      </div>
      <FlashcardsList userId={userId} cards={cards} />
      {userId === session?.user.id && (
        <Link href={`/study-set/${id}/edit`}>
          <Button
            type="primary"
            className="m-auto mb-8 block h-14 font-bold"
            size="large"
          >
            Add or Remove Terms
          </Button>
        </Link>
      )}
      {otherSets.length > 0 && <OtherSets otherSets={otherSets} />}
    </div>
  );
}
