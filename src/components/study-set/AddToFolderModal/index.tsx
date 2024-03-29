import { api } from "@/trpc/react";
import { Button, Empty, Modal, Skeleton } from "antd";
import Text from "antd/es/typography/Text";
import { useFolderModalContext } from "../../../contexts/FolderModalContext";
import StudySetFolder from "../StudySetFolder";

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
        header: "[&>div]:text-2xl mb-2",
      }}
    >
      <Button onClick={handleFolderCreate} className="my-4 w-full">
        Create new folder
      </Button>
      {isLoading && <Skeleton active title={false} />}
      {isError && (
        <div className="flex flex-col items-center py-4">
          <Text className="mb-2">Couldn&apos;t load sets</Text>
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
            <Empty description="You have not sets yet" />
          )}
        </>
      )}
    </Modal>
  );
};

export default AddToFolderModal;
