import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import type { StudySet } from "@prisma/client";
import { Button, Card, message } from "antd";
import { api } from "../../utils/api";

interface FolderStudySetProps {
  folderId: string;
  setsInFolder: StudySet[];
  title: string;
  setId: string;
  userId: string;
  slug: string;
}

const FolderStudySet = ({
  setId,
  title,
  folderId,
  setsInFolder,
  userId,
  slug,
}: FolderStudySetProps) => {
  const {
    folder: {
      getByTitle: { setData },
    },
  } = api.useUtils();
  const { mutate: addSet, isLoading: addLoading } =
    api.folder.addSet.useMutation({
      onSuccess: (data) => {
        setData({ slug, userId }, data);
        void message.success("Added successfully");
      },
      onError: () => {
        void message.error("Couldn't add set");
      },
    });
  const { mutate: removeSet, isLoading: removeLoading } =
    api.folder.removeSet.useMutation({
      onSuccess: (data) => {
        setData({ slug, userId }, data);
        void message.success("Removed successfully");
      },
      onError: () => {
        void message.error("Couldn't remove set");
      },
    });
  const present = setsInFolder.map((set) => set.id).includes(setId);

  const handleAddSet = () => {
    addSet({
      setId,
      folderId,
    });
  };

  const handleRemoveSet = () => {
    removeSet({
      setId,
      folderId,
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">{title}</div>
        <Button
          disabled={addLoading || removeLoading}
          loading={addLoading || removeLoading}
          onClick={present ? handleRemoveSet : handleAddSet}
          type={present ? "primary" : "default"}
          icon={present ? <MinusOutlined /> : <PlusOutlined />}
        />
      </div>
    </Card>
  );
};

export default FolderStudySet;
