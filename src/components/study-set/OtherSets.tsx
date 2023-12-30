import type { Flashcard, StudySet, User } from "@prisma/client";
import React from "react";
import StudySetPreview from "../shared/StudySetPreview";
import { Typography } from "antd";

interface OtherSetsProps {
  otherSets: (StudySet & {
    user: User;
    cards: Flashcard[];
  })[];
}

const OtherSets = ({ otherSets }: OtherSetsProps) => {
  return (
    <div>
      <Typography.Title level={2} className="mb-5 text-lg font-bold">
        Other sets by this creator
      </Typography.Title>
      <div className="grid gap-4 md:grid-cols-2">
        {otherSets.map(
          ({
            id,
            title,
            user: { image: userImage, name: userName, id: authorId },
            cards,
          }) => (
            <StudySetPreview
              key={id}
              title={title}
              authorImage={userImage}
              authorName={userName}
              id={id}
              termsCount={cards.length}
              authorId={authorId}
            />
          )
        )}
      </div>
    </div>
  );
};

export default OtherSets;
