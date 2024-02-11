"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Modal, Tag, Tooltip, message } from "antd";
import { useFolderModalContext } from "../../contexts/FolderModalContext";
import type { EditFolderValues } from "../../schemas/folder";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

interface FolderCTAProps {
  userId: string;
  defaultData: EditFolderValues;
  openAddSetModal: () => void;
}

const FolderCTA = ({
  defaultData,
  openAddSetModal,
  userId,
}: FolderCTAProps) => {
  const router = useRouter();
  const [, dispatch] = useFolderModalContext();
  const [deleteFolderModalOpen, setDeleteFolderModalOpen] =
    useState<boolean>(false);
  const { mutate: deleteFolder, isLoading } = api.folder.delete.useMutation({
    onSuccess: () => {
      void message.success("Deleted successfully");
      router.push(`/${userId}/folders`);
    },
    onError: () => {
      void message.error("Couldn't delete folder");
    },
  });

  const openFolderModal = () => {
    dispatch({ type: "setDefaultData", payload: defaultData });
    dispatch({ type: "open" });
  };

  const openDeleteFolderModal = () => {
    setDeleteFolderModalOpen(true);
  };

  const closeDeleteFolderModal = () => {
    setDeleteFolderModalOpen(false);
  };

  const handleDeleteFolder = () => {
    deleteFolder({ id: defaultData.id });
  };

  return (
    <div className="flex gap-2">
      <Tooltip title="Add set">
        <Button
          icon={<PlusOutlined />}
          onClick={openAddSetModal}
          shape="circle"
          size="large"
        />
      </Tooltip>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        menu={{
          items: [
            {
              key: "1",
              label: "Edit",
              icon: <EditOutlined />,
              onClick: openFolderModal,
            },
            {
              key: "2",
              label: "Delete",
              icon: <DeleteOutlined />,
              onClick: openDeleteFolderModal,
            },
          ],
        }}
      >
        <Button icon={<EllipsisOutlined />} shape="circle" size="large" />
      </Dropdown>
      <Modal
        open={deleteFolderModalOpen}
        onCancel={closeDeleteFolderModal}
        centered
        title="Delete folder"
        onOk={handleDeleteFolder}
        confirmLoading={isLoading}
        okButtonProps={{
          disabled: isLoading,
          danger: true,
          loading: isLoading,
        }}
        okText="Delete"
      >
        <div className="py-5">
          <div className="mb-4 flex items-center text-base">
            Are you sure you want to delete
            <Tag color="red" className="mx-2">
              {defaultData.title}
            </Tag>
            folder
          </div>
          <div>
            Deleting folder cannot be undone. Sets in this folder will not be
            deleted.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FolderCTA;
