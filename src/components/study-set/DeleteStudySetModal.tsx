import { Modal, Tag, Typography, message } from "antd";
import React from "react";
import { api } from "../../utils/api";
import { useRouter } from "next/router";

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
  const { push } = useRouter();
  const { mutate: deleteStudySet, isLoading } = api.studySet.delete.useMutation(
    {
      onSuccess: () => {
        void push("/latest");
      },
      onError: () => {
        void message.error("Couldn't delete study set");
      },
    }
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
      <Typography.Text className="mb-4 block">
        Are you sure you want to delete
        <Tag color="red" className="mx-2">
          {name}
        </Tag>
        study set.
      </Typography.Text>
      <Typography.Text className="mb-4 block">
        Deleting study set will remove all flashcards in this study set. This
        action cannot be undone.
      </Typography.Text>
    </Modal>
  );
};

export default DeleteStudySetModal;
