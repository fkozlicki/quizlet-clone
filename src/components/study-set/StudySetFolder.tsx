import { api } from "@/trpc/react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import type { Folder, StudySet } from "@prisma/client";
import { Button, Card, message } from "antd";
import React from "react";

type FolderWithSets = Folder & {
  studySets: StudySet[];
};

interface StudySetFolderProps {
  folder: FolderWithSets;
  setId: string;
  userId: string;
}

const StudySetFolder = ({ folder, setId, userId }: StudySetFolderProps) => {
  const utils = api.useUtils();
  const { mutate: addSet } = api.folder.addSet.useMutation({
    onMutate({ folderId, setId }) {
      const prevData = utils.folder.getAll.getData({
        userId,
      });
      const studySet = utils.studySet.getById.getData({ id: setId });

      if (!studySet) {
        return;
      }

      utils.folder.getAll.setData({ userId }, (old) => {
        if (!old) {
          return;
        }

        return old.map((folder) =>
          folder.id === folderId
            ? { ...folder, studySets: [...folder.studySets, studySet] }
            : folder,
        );
      });

      return {
        prevData,
      };
    },
    onSettled,
    onError: () => {
      void message.error("Couldn't add to folder");
    },
  });
  const { mutate: removeSet } = api.folder.removeSet.useMutation({
    onMutate({ folderId, setId }: { folderId: string; setId: string }) {
      const prevData = utils.folder.getAll.getData({
        userId,
      });
      const studySet = utils.studySet.getById.getData({ id: setId });

      if (!studySet) {
        return;
      }

      utils.folder.getAll.setData({ userId }, (old) => {
        if (!old) {
          return;
        }

        return old.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                studySets: folder.studySets.filter(
                  (folder) => folder.id !== folderId,
                ),
              }
            : folder,
        );
      });

      return {
        prevData,
      };
    },
    onSettled,
    onError: () => {
      void message.error("Couldn't remove from folder");
    },
  });
  const isIn = folder.studySets.map((set) => set.id).includes(setId);

  const handleAddSet = () => {
    addSet({
      folderId: folder.id,
      setId,
    });
  };

  const handleRemoveSet = () => {
    removeSet({
      folderId: folder.id,
      setId,
    });
  };

  async function onSettled() {
    return await utils.folder.getAll.invalidate();
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-base font-medium">{folder.title}</div>
        <Button
          onClick={isIn ? handleRemoveSet : handleAddSet}
          icon={isIn ? <MinusOutlined /> : <PlusOutlined />}
          type={isIn ? "primary" : "default"}
        />
      </div>
    </Card>
  );
};

export default StudySetFolder;
