import React from "react";
import MemoryCard from "./MemoryCard";
import { type GameCard } from "./MatchMode";

interface GameScreenProps {
  time: number;
  cards: GameCard[];
  selectCard: (index: number) => void;
  checkIsSelected: (index: number) => boolean;
  checkIsMatched: (index: number) => boolean;
  checkIsMisatch: (index: number) => boolean;
}

const GameScreen = ({
  time,
  cards,
  selectCard,
  checkIsSelected,
  checkIsMatched,
  checkIsMisatch,
}: GameScreenProps) => {
  return (
    <div>
      <div className="mb-4 text-xl">{time.toFixed(1)} sec.</div>
      <div className="grid h-full grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <MemoryCard
            key={index}
            content={card.content}
            selectCallback={() => selectCard(index)}
            isSelected={checkIsSelected(index)}
            isMatched={checkIsMatched(index)}
            isMismatch={checkIsMisatch(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
