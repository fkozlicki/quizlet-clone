import type { Flashcard, StudySet, User } from "@prisma/client";
import React from "react";
import StudySetPreview from "../../StudySetPreview";

interface OtherSetsProps {
  otherSets: (StudySet & {
    user: User;
    cards: Flashcard[];
  })[];
}

const OtherSets = ({ otherSets }: OtherSetsProps) => {
  return (
    <div>
      <p className="mb-6 font-bold">Other sets by this creator</p>
      <div className="grid gap-4 md:grid-cols-2">
        {otherSets.map(
          ({
            id,
            title,
            user: { image: userImage, name: userName },
            cards,
          }) => (
            <StudySetPreview
              key={id}
              title={title}
              authorImage={userImage}
              authorName={userName}
              id={id}
              termsCount={cards.length}
            />
          )
        )}
      </div>
    </div>
  );
};

export default OtherSets;
