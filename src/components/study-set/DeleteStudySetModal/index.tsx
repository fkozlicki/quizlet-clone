import { api } from "@/trpc/react";
import { Modal, Tag, message } from "antd";
import Text from "antd/es/typography/Text";
import { useRouter } from "next/navigation";

interface DeleteStudySetModalProps {
  setId: string;
  name: string;
  open: boolean;
  close: () => void;
}

const DeleteStudySetModal = ({
  name,
  open,
  setId,
  close,
}: DeleteStudySetModalProps) => {
  const router = useRouter();
  const { mutate: deleteStudySet, isLoading } = api.studySet.delete.useMutation(
    {
      onSuccess: () => {
        router.push("/latest");
      },
      onError: () => {
        void message.error("Couldn't delete study set");
      },
    },
  );

  const handleDeleteStudySet = () => {
    deleteStudySet({
      setId,
    });
  };

  return (
    <Modal
      title="Delete Study Set"
      centered
      open={open}
      onOk={handleDeleteStudySet}
      onCancel={close}
      okButtonProps={{
        danger: true,
        disabled: isLoading,
        loading: isLoading,
      }}
      okText="Delete"
    >
      <Text className="mb-4 block">
        Are you sure you want to delete
        <Tag color="red" className="mx-2">
          {name}
        </Tag>
        study set.
      </Text>
      <Text className="mb-4 block">
        Deleting study set will remove all flashcards in this study set. This
        action cannot be undone.
      </Text>
    </Modal>
  );
};

export default DeleteStudySetModal;
