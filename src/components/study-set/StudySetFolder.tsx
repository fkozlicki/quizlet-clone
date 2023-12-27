import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import type { Folder, StudySet } from "@prisma/client";
import { Button, Card, message } from "antd";
import React from "react";
import { api } from "../../utils/api";

type FolderWithSets = Folder & {
  studySets: StudySet[];
};

interface StudySetFolderProps {
  folder: FolderWithSets;
  setId: string;
  userId: string;
}

const StudySetFolder = ({ folder, setId, userId }: StudySetFolderProps) => {
  const {
    folder: {
      getAll: { setData },
    },
  } = api.useUtils();
  const { mutate: addSet, isLoading: addLoading } =
    api.folder.addSet.useMutation({
      onSuccess: (data) => {
        updateFolder(data);
        void message.success("Added successfully");
      },
      onError: () => {
        void message.error("Couldn't add to folder");
      },
    });
  const { mutate: removeSet, isLoading: removeLoading } =
    api.folder.removeSet.useMutation({
      onSuccess: (data) => {
        updateFolder(data);
        void message.success("Removed successfully");
      },
      onError: () => {
        void message.error("Couldn't remove from folder");
      },
    });
  const isIn = folder.studySets.map((set) => set.id).includes(setId);

  const updateFolder = (data: FolderWithSets) => {
    setData({ userId }, (oldData) => {
      if (!oldData) {
        return;
      }

      return oldData.map((folder) => (folder.id === data.id ? data : folder));
    });
  };

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

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-base font-medium">{folder.title}</div>
        <Button
          onClick={isIn ? handleRemoveSet : handleAddSet}
          icon={isIn ? <MinusOutlined /> : <PlusOutlined />}
          disabled={addLoading || removeLoading}
          loading={addLoading || removeLoading}
          type={isIn ? "primary" : "default"}
        />
      </div>
    </Card>
  );
};

export default StudySetFolder;
