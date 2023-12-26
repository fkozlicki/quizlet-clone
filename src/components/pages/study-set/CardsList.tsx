import type { Flashcard } from "@prisma/client";
import CardPreview from "../../CardPreview";

interface CardsListProps {
  cards: Flashcard[];
  userId: string;
}

const CardsList = ({ cards, userId }: CardsListProps) => {
  return (
    <div className="mb-8">
      <div className="mb-5 text-lg font-bold">
        Terms in this set ({cards.length})
      </div>
      <div className="flex flex-col gap-3">
        {cards.map((flashcard, index) => (
          <CardPreview userId={userId} key={index} flashcard={flashcard} />
        ))}
      </div>
    </div>
  );
};

export default CardsList;
