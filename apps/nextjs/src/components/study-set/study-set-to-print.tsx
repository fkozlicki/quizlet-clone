import React, { forwardRef } from "react";

import type { RouterOutputs } from "@acme/api";

interface StudySetToPrintProps {
  studySet: RouterOutputs["studySet"]["byId"];
}

const StudySetToPrint = forwardRef<HTMLDivElement, StudySetToPrintProps>(
  ({ studySet }, ref) => {
    const { flashcards, title, description } = studySet;

    return (
      <div className="hidden">
        <div ref={ref} className="m-auto max-w-xl py-8 font-sans">
          <div className="mb-4">
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && <p className="text-xl">{description}</p>}
          </div>
          <div className="mb-2 text-lg font-bold">
            Terms in this set ({flashcards.length})
          </div>
          <div className="flex flex-col gap-2">
            {flashcards.map((flashcard) => (
              <div
                key={flashcard.id}
                className="flex divide-x-2 border px-4 py-2"
              >
                <div className="flex-1 pr-4">{flashcard.term}</div>
                <div className="flex-1 pl-4">{flashcard.definition}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

StudySetToPrint.displayName = "StudySetToPrint";

export default StudySetToPrint;
