import type { StudySet, User } from "@prisma/client";
import Title from "antd/es/typography/Title";
import StudySetPreview from "../../shared/StudySetPreview";

interface OtherSetsProps {
  otherSets: (StudySet & {
    user: Pick<User, "id" | "image" | "name">;
    _count: { cards: number };
  })[];
}

const OtherSets = ({ otherSets }: OtherSetsProps) => {
  return (
    <div>
      <Title level={2} className="mb-5 text-lg font-bold">
        Other sets by this creator
      </Title>
      <div className="grid gap-4 md:grid-cols-2">
        {otherSets.map((set) => (
          <StudySetPreview key={set.id} studySet={set} />
        ))}
      </div>
    </div>
  );
};

export default OtherSets;
