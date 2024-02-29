import React from "react";
import IconCard from "../IconCard";

interface StudyModesProps {
  setId?: string;
}

const StudyModes = ({ setId }: StudyModesProps) => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <IconCard
        icon="/cards.png"
        text="Flashcards"
        href={`${setId}/flashcards`}
      />
      <IconCard icon="/study.png" text="Learn" href={`${setId}/learn`} />
      <IconCard icon="/file.png" text="Test" href={`${setId}/test`} />
      <IconCard icon="/puzzle.png" text="Match" href={`${setId}/match`} />
    </div>
  );
};

export default StudyModes;
