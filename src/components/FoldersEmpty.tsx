"use client";

import { useFolderModalContext } from "@/contexts/FolderModalContext";
import { Button, Empty } from "antd";
import { useSession } from "next-auth/react";
import React from "react";

const FoldersEmpty = ({ userId }: { userId: string }) => {
  const [, dispatch] = useFolderModalContext();
  const { data: session } = useSession();

  const openFolderModal = () => {
    dispatch({ type: "open" });
  };

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={`${
        userId === session?.user.id ? "You have" : "User has"
      } no folders yet`}
    >
      {userId === session?.user.id && (
        <Button onClick={openFolderModal} type="primary">
          Create
        </Button>
      )}
    </Empty>
  );
};

export default FoldersEmpty;
