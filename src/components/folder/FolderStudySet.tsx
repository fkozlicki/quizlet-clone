import { api } from "@/trpc/react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import type { Flashcard, StudySet, User } from "@prisma/client";
import { Button, Card, message } from "antd";
import Text from "antd/es/typography/Text";

interface FolderStudySetProps {
  studySet: StudySet & { user: User; cards: Flashcard[] };
  folderId: string;
  setsInFolder: StudySet[];
  userId: string;
  slug: string;
}

const FolderStudySet = ({
  studySet,
  folderId,
  setsInFolder,
  userId,
  slug,
}: FolderStudySetProps) => {
  const utils = api.useUtils();
  const { mutate: addSet } = api.folder.addSet.useMutation({
    onMutate() {
      const prevData = utils.folder.getByTitle.getData({ userId, slug });

      utils.folder.getByTitle.setData({ userId, slug }, (old) => {
        if (!old) {
          return;
        }

        return {
          ...old,
          studySets: [...old.studySets, studySet],
        };
      });

      return {
        prevData,
      };
    },
    onError: () => {
      void message.error("Couldn't add set");
    },
  });
  const { mutate: removeSet } = api.folder.removeSet.useMutation({
    onMutate() {
      const prevData = utils.folder.getByTitle.getData({ userId, slug });

      utils.folder.getByTitle.setData({ userId, slug }, (old) => {
        if (!old) {
          return;
        }

        return {
          ...old,
          studySets: old.studySets.filter((set) => set.id !== studySet.id),
        };
      });

      return {
        prevData,
      };
    },
    onError: () => {
      void message.error("Couldn't remove set");
    },
  });
  const present = setsInFolder.map((set) => set.id).includes(studySet.id);

  const handleAddSet = () => {
    addSet({
      setId: studySet.id,
      folderId,
    });
  };

  const handleRemoveSet = () => {
    removeSet({
      setId: studySet.id,
      folderId,
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <Text className="text-xl font-bold">{studySet.title}</Text>
        <Button
          className="shrink-0"
          onClick={present ? handleRemoveSet : handleAddSet}
          type={present ? "primary" : "default"}
          icon={present ? <MinusOutlined /> : <PlusOutlined />}
        />
      </div>
    </Card>
  );
};

export default FolderStudySet;
