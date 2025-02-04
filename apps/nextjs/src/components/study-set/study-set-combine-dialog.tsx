import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon, MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

interface StudySetCombineCardProps {
  title: string;
  selected: boolean;
  onClick: () => void;
}

const StudySetCombineCard = ({
  title,
  selected,
  onClick,
}: StudySetCombineCardProps) => {
  return (
    <Card onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span>{title}</span>
          <Button size="icon" variant={selected ? "primary" : "outline"}>
            {selected ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface StudySetCombineDialogProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const StudySetCombineDialog = ({
  open,
  onOpenChange,
  userId,
  id,
}: StudySetCombineDialogProps) => {
  const utils = api.useUtils();
  const studySet = utils.studySet.byId.getData({ id });
  const { data: studySets } = api.studySet.allByUser.useQuery({
    userId,
  });
  const router = useRouter();
  const { mutate, isPending } = api.studySet.combine.useMutation({
    async onSuccess(data) {
      router.push(`/study-sets/${data.id}`);
      toast.success("Successfully combined study sets");
      onOpenChange(false);
      await utils.studySet.invalidate();
    },
    onError() {
      toast.error("Couldn't combine study sets");
    },
  });
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCard = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const combine = () => {
    mutate({ id, studySets: selected });
  };

  const isDisabled = isPending || selected.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Combine</DialogTitle>
          <DialogDescription>
            Select study sets you want to combine with {studySet?.title}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {studySets
            ?.filter((studySet) => studySet.id !== id)
            .map((studySet) => (
              <StudySetCombineCard
                key={studySet.id}
                onClick={() => toggleCard(studySet.id)}
                selected={selected.includes(studySet.id)}
                title={studySet.title}
              />
            ))}
        </div>
        <DialogFooter>
          <DialogClose asChild disabled={isPending}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={combine} disabled={isDisabled}>
            {isPending ? (
              <LoaderIcon size={20} className="animate-spin" />
            ) : (
              "Combine"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudySetCombineDialog;
