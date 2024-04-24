import React from "react";

import { Card, CardContent } from "@acme/ui/card";

interface MemoryCardProps {
  index: number;
  content: string;
  selectCallback: () => void;
}

const MemoryCard = ({ index, content, selectCallback }: MemoryCardProps) => {
  return (
    <Card
      id={`card-${index}`}
      onClick={selectCallback}
      className="cursor-pointer border-2"
    >
      <CardContent className="flex min-h-[10rem] items-center justify-center p-4">
        <span className="font-medium">{content}</span>
      </CardContent>
    </Card>
  );
};

export default MemoryCard;
