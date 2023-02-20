import type { Flashcard } from "@prisma/client";
import Link from "next/link";
import React from "react";
import CardPreview from "../../CardPreview";

interface CardsListProps {
  cards: Flashcard[];
  setId: string;
}

const CardsList = ({ cards, setId }: CardsListProps) => {
  return (
    <div className="mb-12">
      <p className="mb-5 text-lg font-bold">
        Terms in this set ({cards.length})
      </p>
      <div className="mb-8 flex flex-col gap-3">
        {cards.map(({ term, definition }, index) => (
          <CardPreview key={index} term={term} definition={definition} />
        ))}
      </div>
      <Link
        href={`${setId}/edit`}
        className="m-auto block w-fit rounded-lg bg-blue-700 px-8 py-5 font-medium text-white hover:bg-blue-800"
      >
        Add or Remove Terms
      </Link>
    </div>
  );
};

export default CardsList;
