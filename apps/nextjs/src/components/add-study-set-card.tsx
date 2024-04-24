"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LoaderCircle, Minus, Plus } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

import { api } from "~/trpc/react";

interface AddStudySetCardProps {
  studySetId: string;
  isIn: boolean;
  folderId: string;
  revalidate: "folder" | "studySet";
}

const AddStudySetCard = ({
  studySetId,
  isIn,
  folderId,
  revalidate,
}: AddStudySetCardProps) => {
  const { slug }: { slug: string } = useParams();
  const utils = api.useUtils();
  const { mutate, isPending } = api.folder[
    isIn ? "removeSet" : "addSet"
  ].useMutation({
    async onSuccess() {
      if (revalidate === "folder") {
        await utils.folder.bySlug.invalidate({ slug });
      } else {
        await utils.studySet.byId.invalidate({ id: studySetId });
      }
    },
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
        <span>study set name</span>
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
