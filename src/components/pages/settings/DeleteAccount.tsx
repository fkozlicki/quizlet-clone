import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import type { User } from "@prisma/client";
import { Alert, Avatar, Button, Modal, message } from "antd";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { api } from "../../../utils/api";

interface DeleteAccountProps {
  image: User["image"];
  userName: User["name"];
}

const DeleteAccount = ({ userName, image }: DeleteAccountProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { mutate: deleteAccount, isLoading } = api.user.delete.useMutation({
    onSuccess: async () => {
      await signOut();
      void message.success("Account deleted");
    },
    onError: () => {
      void message.error("Couldn't delete an account");
    },
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
      <div className="flex items-center gap-2 lg:basis-48 lg:flex-col lg:justify-center">
        <CloseOutlined className="text-4xl" />
        <div className="text-xl font-semibold">Delete Account</div>
      </div>
      <div className="flex-1 rounded-lg bg-white p-4 shadow">
        <div className="mb-4 text-xl font-semibold">
          Permanently delete {userName}
        </div>
        <Alert
          message="Be careful - this will delete all your data and connot be undone"
          type="warning"
          className="mb-5 w-fit"
        />
        <Button onClick={openModal} type="primary" danger size="large">
          Delete Account
        </Button>
      </div>
      <Modal
        open={modalOpen}
        title="Delete Account"
        onCancel={closeModal}
        onOk={() => deleteAccount()}
        confirmLoading={isLoading}
        centered
        okButtonProps={{
          disabled: isLoading,
        }}
      >
        <div className="mb-4 text-lg">
          Are you sure you want to delete account:
        </div>
        <Alert
          className="mb-8"
          message={
            <div className="flex items-center gap-4">
              <Avatar icon={<UserOutlined />} src={image} alt="avatar" />
              <span className="font-medium">{userName}</span>
            </div>
          }
          type="error"
        />
      </Modal>
    </div>
  );
};

export default DeleteAccount;
