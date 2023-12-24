import type { Flashcard } from "@prisma/client";
import Link from "next/link";
import React from "react";
import CardPreview from "../../CardPreview";
import { Button } from "antd";

interface CardsListProps {
  cards: Flashcard[];
  setId: string;
  openEditModal: (flashcard: Flashcard) => void;
}

const CardsList = ({ cards, setId, openEditModal }: CardsListProps) => {
  return (
    <div className="mb-12">
      <p className="mb-5 text-lg font-bold">
        Terms in this set ({cards.length})
      </p>
      <div className="mb-8 flex flex-col gap-3">
        {cards.map((flashcard, index) => (
          <CardPreview
            key={index}
            flashcard={flashcard}
            openEditModal={() => openEditModal(flashcard)}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Link href={`${setId}/edit`}>
          <Button type="primary" className="h-14 font-medium" size="large">
            Add or Remove Terms
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CardsList;
