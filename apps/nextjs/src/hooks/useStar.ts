import type { MouseEvent } from "react";
import { useParams } from "next/navigation";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";

export default function useStar(
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][0],
) {
  const utils = api.useUtils();
  const { id }: { id: string } = useParams();
  const createStar = api.starredFlashcard.create.useMutation({
    onMutate: ({ flashcardId }) => updateStudySet(flashcardId, true),
    onSettled,
  });
  const deleteStar = api.starredFlashcard.delete.useMutation({
    onMutate: ({ flashcardId }) => updateStudySet(flashcardId, false),
    onSettled,
  });

  async function onSettled() {
    await utils.studySet.byId.invalidate({ id });
  }

  function updateStudySet(flashcardId: number, starred: boolean) {
    const prevData = utils.studySet.byId.getData({ id });

    utils.studySet.byId.setData({ id }, (old) => {
      if (!old) {
        return;
      }

      return {
        ...old,
        flashcards: old.flashcards.map((card) =>
          card.id === flashcardId ? { ...card, starred } : card,
        ),
      };
    });

    return {
      prevData,
    };
  }

  const toggleStar = (event: MouseEvent) => {
    event.stopPropagation();

    if (flashcard.starred) {
      deleteStar.mutate({
        flashcardId: flashcard.id,
      });
    } else {
      createStar.mutate({
        flashcardId: flashcard.id,
      });
    }
  };

  return { toggleStar };
}
