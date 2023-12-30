import { Card, theme } from "antd";
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
  const {
    token: {
      red1,
      red5,
      green1,
      green5,
      colorBorder,
      colorBgContainer,
      blue4,
      blue3,
    },
  } = theme.useToken();

  return (
    <Card
      onClick={selectCallback}
      className={`flex min-h-[10rem] cursor-pointer items-center justify-center rounded border-2 border-gray-300 font-medium transition-transform duration-300 ${
        isMatched ? "scale-0" : ""
      } ${isMismatch ? "animate-shake" : ""}`}
      style={{
        borderColor: isMatched
          ? green5
          : isMismatch
          ? red5
          : isSelected
          ? blue3
          : colorBorder,
        background: isMatched
          ? green1
          : isMismatch
          ? red1
          : isSelected
          ? blue4
          : colorBgContainer,
      }}
    >
      {content}
    </Card>
  );
};

export default MemoryCard;
