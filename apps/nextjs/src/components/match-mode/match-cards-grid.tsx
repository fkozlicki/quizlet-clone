import { useMatchModeContext } from "~/contexts/match-mode-context";
import MemoryCard from "./memory-card";

export default function MatchCardsGrid() {
  const { cards } = useMatchModeContext();

  return (
    <div className="grid h-full grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <MemoryCard key={index} index={index} content={card.content} />
      ))}
    </div>
  );
}
