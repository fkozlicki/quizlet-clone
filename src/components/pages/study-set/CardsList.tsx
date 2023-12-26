import type { Flashcard } from "@prisma/client";
import CardPreview from "../../CardPreview";

interface CardsListProps {
  cards: Flashcard[];
  openEditModal: (flashcard: Flashcard) => void;
  userId: string;
}

const CardsList = ({ cards, openEditModal, userId }: CardsListProps) => {
  return (
    <div className="mb-8">
      <div className="mb-5 text-lg font-bold">
        Terms in this set ({cards.length})
      </div>
      <div className="flex flex-col gap-3">
        {cards.map((flashcard, index) => (
          <CardPreview
            userId={userId}
            key={index}
            flashcard={flashcard}
            openEditModal={() => openEditModal(flashcard)}
          />
        ))}
      </div>
    </div>
  );
};

export default CardsList;
