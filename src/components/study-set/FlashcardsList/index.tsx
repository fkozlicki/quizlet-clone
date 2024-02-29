import type { Flashcard } from "@prisma/client";
import Title from "antd/es/typography/Title";
import FlashcardPreview from "../../shared/FlashcardPreview";

interface FlashcardsListProps {
  cards: Flashcard[];
  userId: string;
}

const FlashcardsList = ({ cards, userId }: FlashcardsListProps) => {
  return (
    <div className="mb-8">
      <Title level={2} className="mb-5 text-lg font-bold">
        Terms in this set ({cards.length})
      </Title>
      <div className="flex flex-col gap-3">
        {cards.map((flashcard, index) => (
          <FlashcardPreview userId={userId} key={index} flashcard={flashcard} />
        ))}
      </div>
    </div>
  );
};

export default FlashcardsList;
