import type { MouseEvent } from "react";
import { useParams } from "next/navigation";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";

export default function useStar(
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][0],
) {
  const utils = api.useUtils();
  const { id }: { id: string } = useParams();
  const createStarred = api.starredFlashcard.create.useMutation({
    async onSuccess() {
      await utils.studySet.byId.invalidate({ id });
    },
  });
  const deleteStarred = api.starredFlashcard.delete.useMutation({
    async onSuccess() {
      await utils.studySet.byId.invalidate({ id });
    },
  });

  const toggleStar = (event: MouseEvent) => {
    event.stopPropagation();

    if (flashcard.starred) {
      deleteStarred.mutate({
        flashcardId: flashcard.id,
      });
    } else {
      createStarred.mutate({
        flashcardId: flashcard.id,
      });
    }
  };

  return { toggleStar };
}
