import {
  EllipsisHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../../utils/api";
import IconButton from "../../IconButton";
import type { FolderInputs } from "../../layout/FolderModal";
import FolderModal from "../../layout/FolderModal";

interface FolderCTAProps {
  refetch: () => void;
  defaultData: {
    title: string;
    description: string | null;
  };
  slug: string;
  userId: string;
  folderId: string;
  openAddSetModal: () => void;
}

const FolderCTA = ({
  refetch,
  defaultData,
  slug,
  userId,
  folderId,
  openAddSetModal,
}: FolderCTAProps) => {
  const { push } = useRouter();
  const [optionsModalOpen, setOptionsModalOpen] = useState<boolean>(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] =
    useState<boolean>(false);
  const {
    mutate,
    error: editError,
    reset: resetFolderMutation,
  } = api.folder.edit.useMutation({
    onSuccess: async (data) => {
      toast("Successfully edited folder");
      if (slug === data.slug) {
        refetch();
      } else {
        await push(`/${userId}/folders/${data.slug}`);
      }
      closeCreateFolder();
    },
    onError: () => {
      toast("Couldn't edit folder");
    },
  });

  const submitEdit = (data: FolderInputs) => {
    mutate({
      id: folderId,
      title: data.title,
      description: data.description,
    });
  };

  const toggleOptionsModal = () => {
    setOptionsModalOpen((prev) => !prev);
  };

  const openEditFolderModal = () => {
    setOptionsModalOpen(false);
    setCreateFolderModalOpen(true);
  };

  const closeCreateFolder = () => {
    setCreateFolderModalOpen(false);
  };

  return (
    <div>
      <div className="flex gap-2">
        <IconButton Icon={PlusIcon} size={24} onClick={openAddSetModal} />
        <div className="relative">
          <IconButton
            Icon={EllipsisHorizontalIcon}
            size={28}
            onClick={toggleOptionsModal}
          />
          {optionsModalOpen && (
            <div className="absolute top-[110%] right-0 z-20 min-w-[160px] rounded-xl bg-white py-2 shadow">
              <button
                onClick={openEditFolderModal}
                className="flex w-full gap-4 px-4 py-2 hover:bg-slate-100"
              >
                <PencilIcon width={20} />
                <span>Edit</span>
              </button>
              <button className="flex w-full gap-4 px-4 py-2 hover:bg-slate-100">
                <TrashIcon width={20} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {createFolderModalOpen && (
        <FolderModal
          variant="edit"
          defaultData={defaultData}
          closeCreateFolder={closeCreateFolder}
          mutate={submitEdit}
          resetFolderMutation={resetFolderMutation}
          errorMessage={editError?.message}
        />
      )}
    </div>
  );
};

export default FolderCTA;
