import type { Flashcard, StudySet, User } from "@prisma/client";
import React from "react";
import StudySetPreview from "../../StudySetPreview";

interface FolderContentProps {
  studySets: (StudySet & {
    user: User;
    cards: Flashcard[];
  })[];
}

const FolderContent = ({ studySets }: FolderContentProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {studySets.map(
        ({ title, id, cards, user: { image, name }, userId }, index) => (
          <StudySetPreview
            key={index}
            title={title}
            id={id}
            termsCount={cards.length}
            authorImage={image}
            authorName={name}
            authorId={userId}
          />
        )
      )}
    </div>
  );
};

export default FolderContent;
