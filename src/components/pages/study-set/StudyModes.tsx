import React from "react";
import IconCard from "../../IconCard";

interface StudyModesProps {
  setId: string;
}

const StudyModes = ({ setId }: StudyModesProps) => {
  return (
    <div className="mb-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <IconCard
        icon="/cards.png"
        text="Flashcards"
        link={`${setId}/flashcards`}
      />
      <IconCard icon="/study.png" text="Learn" link={`${setId}/learn`} />
      <IconCard icon="/file.png" text="Test" link={`${setId}/test`} />
      <IconCard icon="/puzzle.png" text="Match" link={`${setId}/match`} />
    </div>
  );
};

export default StudyModes;
