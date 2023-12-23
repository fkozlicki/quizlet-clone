import {
  EllipsisHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useFolderModalContext } from "../../../contexts/FolderModalContext";
import IconButton from "../../IconButton";
import type { FolderInputs } from "../../layout/FolderModal";

interface FolderCTAProps {
  defaultData: FolderInputs;
  openAddSetModal: () => void;
}

const FolderCTA = ({ defaultData, openAddSetModal }: FolderCTAProps) => {
  const [optionsModalOpen, setOptionsModalOpen] = useState<boolean>(false);
  const [, dispatch] = useFolderModalContext();

  const toggleOptionsModal = () => {
    setOptionsModalOpen((prev) => !prev);
  };

  const openEditFolderModal = () => {
    setOptionsModalOpen(false);
    dispatch({ type: "setDefaultData", payload: defaultData });
    dispatch({ type: "open" });
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
    </div>
  );
};

export default FolderCTA;
