import { Button, Empty, Modal } from "antd";
import React from "react";
import { api } from "../../utils/api";
import { LoadingOutlined } from "@ant-design/icons";
import StudySetFolder from "./StudySetFolder";
import { useFolderModalContext } from "../../contexts/FolderModalContext";

interface AddToFolderModalProps {
  open: boolean;
  onCancel: () => void;
  userId: string;
  setId: string;
}

const AddToFolderModal = ({
  open,
  onCancel,
  userId,
  setId,
}: AddToFolderModalProps) => {
  const {
    data: folders,
    isLoading,
    isError,
    refetch,
    status,
  } = api.folder.getAll.useQuery({
    userId,
  });
  const [, dispatch] = useFolderModalContext();

  const handleFolderCreate = () => {
    onCancel();
    dispatch({ type: "open" });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      title="Add to folder"
      classNames={{
        footer: "hidden",
        header: "[&>div]:text-2xl mb-6",
      }}
    >
      <Button onClick={handleFolderCreate} className="my-4 w-full">
        Create new folder
      </Button>
      {isLoading && <LoadingOutlined />}
      {isError && (
        <div>
          <div>Couldn&apos;t load sets</div>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      )}
      {status === "success" && (
        <>
          {folders.length > 0 ? (
            <div className="flex flex-col gap-4">
              {folders.map((folder) => (
                <StudySetFolder
                  key={folder.id}
                  folder={folder}
                  setId={setId}
                  userId={userId}
                />
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="You have not sets yet"
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default AddToFolderModal;
