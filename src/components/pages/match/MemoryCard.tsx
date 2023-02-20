import React from "react";

interface MemoryCardProps {
  content: string;
  selectCallback: () => void;
  isSelected: boolean;
  isMatched: boolean;
  isMismatch: boolean;
}

const MemoryCard = ({
  content,
  selectCallback,
  isSelected,
  isMatched,
  isMismatch,
}: MemoryCardProps) => {
  return (
    <div
      onClick={selectCallback}
      className={`flex min-h-[10rem] cursor-pointer items-center justify-center rounded border-2 border-gray-300 font-medium transition-transform duration-300 ${
        isSelected ? "bg-slate-200" : ""
      } ${isMatched ? "scale-0 border-green-600 bg-green-600" : ""} ${
        isMismatch ? "animate-shake border-red-800 bg-red-800" : ""
      }`}
    >
      {content}
    </div>
  );
};

export default MemoryCard;
