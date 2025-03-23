import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import ToggleCard from "../shared/toggle-card";

export default function StudySetFolderCard({
  folder: { id, name },
  isIn,
  studySetId,
}: {
  isIn: boolean;
  studySetId: string;
  folder: RouterOutputs["folder"]["allByUser"][number];
}) {
  const utils = api.useUtils();
  const addSet = api.folder.addSet.useMutation({
    onSettled,
    onMutate() {
      const prevData = utils.studySet.byId.getData({ id: studySetId });

      utils.studySet.byId.setData({ id: studySetId }, (old) => {
        if (!old) {
          return;
        }

        return {
          ...old,
          folders: [...old.folders, { id }],
        };
      });

      return {
        prevData,
      };
    },
  });
  const removeSet = api.folder.removeSet.useMutation({
    onSettled,
    onMutate() {
      const prevData = utils.studySet.byId.getData({ id: studySetId });

      utils.studySet.byId.setData({ id: studySetId }, (old) => {
        if (!old) {
          return;
        }

        return {
          ...old,
          folders: old.folders.filter((folder) => folder.id !== id),
        };
      });

      return {
        prevData,
      };
    },
  });

  async function onSettled() {
    await utils.studySet.byId.invalidate({ id });
  }

  function onClick() {
    const params = {
      folderId: id,
      studySetId,
    };

    if (isIn) {
      removeSet.mutate(params);
    } else {
      addSet.mutate(params);
    }
  }

  return <ToggleCard isIn={isIn} onClick={onClick} name={name} />;
}
