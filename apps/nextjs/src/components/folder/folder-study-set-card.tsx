"use client";

import { useParams } from "next/navigation";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import ToggleCard from "../shared/toggle-card";

export default function FolderStudySetCard({
  studySet,
  isIn,
  folderId,
}: {
  studySet: RouterOutputs["folder"]["bySlug"]["studySets"][number];
  isIn: boolean;
  folderId: string;
}) {
  const { slug }: { slug: string } = useParams();
  const utils = api.useUtils();
  const addSet = api.folder.addSet.useMutation({
    onSettled,
    onMutate() {
      const prevData = utils.folder.bySlug.getData({ slug });

      utils.folder.bySlug.setData({ slug }, (old) => {
        if (!old) {
          return;
        }

        return {
          ...old,
          studySets: [...old.studySets, studySet].sort((a, b) =>
            a.title.localeCompare(b.title),
          ),
        };
      });

      return {
        prevData,
      };
    },
  });
  const removeSet = api.folder.removeSet.useMutation({
    onSettled,
    onMutate({ studySetId }) {
      const prevData = utils.folder.bySlug.getData({ slug });

      utils.folder.bySlug.setData({ slug }, (old) => {
        if (!old) {
          return;
        }

        return {
          ...old,
          studySets: old.studySets.filter((set) => set.id !== studySetId),
        };
      });

      return {
        prevData,
      };
    },
  });

  async function onSettled() {
    await utils.folder.bySlug.invalidate({ slug });
  }

  function onClick() {
    const params = {
      folderId,
      studySetId: studySet.id,
    };

    if (isIn) {
      removeSet.mutate(params);
    } else {
      addSet.mutate(params);
    }
  }

  return <ToggleCard isIn={isIn} onClick={onClick} name={studySet.title} />;
}
