"use client";

import { useParams } from "next/navigation";

import type { Session } from "@acme/auth";

import { api } from "~/trpc/react";
import FlashcardCard from "../shared/flashcard-card";

const StudySetFlashcards = ({ session }: { session: Session | null }) => {
  const { id }: { id: string } = useParams();
  const { data } = api.studySet.byId.useQuery({ id });

  return (
    <div className="mb-8">
      <span className="mb-5 inline-block text-lg font-bold">
        Terms in this set ({data?.flashcards.length})
      </span>
      <div className="flex flex-col gap-3">
        {data?.flashcards.map((flashcard, index) => (
          <FlashcardCard
            editable={data.userId === session?.user.id}
            key={index}
            flashcard={flashcard}
            session={session}
          />
        ))}
      </div>
    </div>
  );
};

export default StudySetFlashcards;
