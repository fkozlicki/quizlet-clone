import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import type { StudySet } from "@prisma/client";
import { Button, Card } from "antd";
import { api } from "../../../utils/api";

interface StudySetCardProps {
  folderId: string;
  setsInFolder: StudySet[];
  title: string;
  setId: string;
}

const StudySetCard = ({
  title,
  folderId,
  setId,
  setsInFolder,
}: StudySetCardProps) => {
  const { mutate: addSet } = api.folder.addSet.useMutation();
  const { mutate: removeSet } = api.folder.removeSet.useMutation();
  const setsIds = setsInFolder.map((set) => set.id);
  const present = setsIds.includes(setId);

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
          onClick={present ? handleRemoveSet : handleAddSet}
          type={present ? "primary" : "default"}
          icon={present ? <MinusOutlined /> : <PlusOutlined />}
        />
      </div>
    </Card>
  );
};

export default StudySetCard;
