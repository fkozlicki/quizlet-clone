import {
  ApiOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  PrinterOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Tooltip } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import AddToFolderModal from "./AddToFolderModal";

interface StudySetCTAProps {
  userId: string;
  setId: string;
}

const StudySetCTA = ({ userId, setId }: StudySetCTAProps) => {
  const { data: session } = useSession();
  const [addToFolderModalOpen, setAddToFolderModalOpen] =
    useState<boolean>(false);

  const openAddToFolderModal = () => {
    setAddToFolderModalOpen(true);
  };

  const closeAddToFolderModal = () => [setAddToFolderModalOpen(false)];

  return (
    <div className="flex gap-2">
      {session && (
        <AddToFolderModal
          open={addToFolderModalOpen}
          onCancel={closeAddToFolderModal}
          userId={session.user.id}
          setId={setId}
        />
      )}
      {session && (
        <Tooltip title="Add to folder">
          <Button
            onClick={openAddToFolderModal}
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
          />
        </Tooltip>
      )}
      {session?.user.id === userId && (
        <Tooltip title="Edit">
          <Link href={`${setId}/edit`}>
            <Button shape="circle" icon={<EditOutlined />} size="large" />
          </Link>
        </Tooltip>
      )}
      <Tooltip title="Share">
        <Button shape="circle" icon={<ShareAltOutlined />} size="large" />
      </Tooltip>
      <Dropdown
        placement="bottomRight"
        menu={{
          items: (session?.user.id === userId
            ? [
                {
                  key: 0,
                  label: "Combine",
                  icon: <ApiOutlined className="mr-4 text-lg" />,
                },
              ]
            : []
          ).concat(
            [
              {
                key: 1,
                label: "Print",
                icon: <PrinterOutlined className="mr-4 text-lg" />,
              },
              {
                key: 2,
                label: "Export",
                icon: <DownloadOutlined className="mr-4 text-lg" />,
              },
            ].concat(
              session?.user.id === userId
                ? [
                    {
                      key: 3,
                      label: "Delete",
                      icon: <DeleteOutlined className="mr-4 text-lg" />,
                    },
                  ]
                : []
            )
          ),
        }}
        trigger={["click"]}
      >
        <Button shape="circle" icon={<EllipsisOutlined />} size="large" />
      </Dropdown>
    </div>
  );
};

export default StudySetCTA;
