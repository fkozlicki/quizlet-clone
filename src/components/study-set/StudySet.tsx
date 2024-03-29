"use client";

import FlashcardsGame from "@/components/flashcards-mode/FlashcardsGame";
import FlashcardsList from "@/components/study-set/FlashcardsList";
import OtherSets from "@/components/study-set/OtherSets";
import StudyModes from "@/components/study-set/StudyModes";
import StudySetCTA from "@/components/study-set/StudySetCTA";
import { api } from "@/trpc/react";
import { Button } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CreatedBy from "./CreatedBy";

const StudySet = ({ id }: { id: string }) => {
  const { data: session } = useSession();
  const { data: studySet } = api.studySet.getById.useQuery({
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
};

export default StudySet;
