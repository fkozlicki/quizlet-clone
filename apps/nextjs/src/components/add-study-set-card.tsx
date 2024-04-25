"use client";

import { LoaderCircle, Minus, Plus } from "lucide-react";

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
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <>{isIn ? <Minus size={14} /> : <Plus size={14} />}</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddStudySetCard;
