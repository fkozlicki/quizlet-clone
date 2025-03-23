"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

interface ToggleCardProps {
  name: string;
  isIn: boolean;
  onClick: () => void;
}

const ToggleCard = ({ name, isIn, onClick }: ToggleCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <span>{name}</span>
        <Button
          onClick={onClick}
          variant={isIn ? "primary" : "outline"}
          size="icon"
        >
          {isIn ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToggleCard;
