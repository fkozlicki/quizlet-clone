import { Button, Empty } from "antd";
import { useSession } from "next-auth/react";
import React from "react";

interface EmptyFolderProps {
  openAddSetModal: () => void;
  ownerId: string;
}

const EmptyFolder = ({ openAddSetModal, ownerId }: EmptyFolderProps) => {
  const { data: session } = useSession();

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="This folder has no sets yet"
    >
      {session?.user.id === ownerId && (
        <Button type="primary" onClick={openAddSetModal}>
          Add a set
        </Button>
      )}
    </Empty>
  );
};

export default EmptyFolder;
