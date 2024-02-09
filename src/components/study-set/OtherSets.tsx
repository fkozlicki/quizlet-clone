import type { StudySet, User } from "@prisma/client";
import { Typography } from "antd";
import StudySetPreview from "../shared/StudySetPreview";

interface OtherSetsProps {
  otherSets: (StudySet & {
    user: User;
    _count: { cards: number };
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
            _count: { cards: termsCount },
          }) => (
            <StudySetPreview
              key={id}
              title={title}
              authorImage={userImage}
              authorName={userName}
              id={id}
              termsCount={termsCount}
              authorId={authorId}
            />
          )
        )}
      </div>
    </div>
  );
};

export default OtherSets;
