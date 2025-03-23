"use client";

import { Loader2Icon, Minus, Plus } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

import { api } from "~/trpc/react";

interface AddStudySetCardProps {
  studySetId: string;
  folderId: string;
  name: string;
  isIn: boolean;
  onMutate: () => void;
  onSettled: () => Promise<void>;
}

const AddStudySetCard = ({
  studySetId,
  folderId,
  name,
  isIn,
  onMutate,
  onSettled,
}: AddStudySetCardProps) => {
  const { mutate, isPending } = api.folder[
    isIn ? "removeSet" : "addSet"
  ].useMutation({
    onSettled,
    onMutate,
  });

  const onClick = () => {
    mutate({
      folderId,
      studySetId,
    });
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <span>{name}</span>
        <Button
          onClick={onClick}
          variant={isIn ? "primary" : "outline"}
          size="icon"
        >
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <>
              {isIn ? (
                <Minus className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddStudySetCard;
