import {
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import React from "react";
import IconButton from "../../IconButton";

interface StudySetCTAProps {
  userId: string;
  setId: string;
  toggleMenu: () => void;
  closeMenu: () => void;
  menuOpen: boolean;
}

const StudySetCTA = ({
  userId,
  setId,
  toggleMenu,
  closeMenu,
  menuOpen,
}: StudySetCTAProps) => {
  const { data: session } = useSession();

  return (
    <div className="mb-10 flex gap-2">
      <IconButton Icon={PlusIcon} size={20} />
      {session?.user?.id === userId && (
        <IconButton
          Icon={PencilIcon}
          size={18}
          as="link"
          href={`${setId}/edit`}
        />
      )}
      <IconButton Icon={ArrowUpTrayIcon} size={20} />
      <div className="relative">
        <IconButton
          size={20}
          onClick={toggleMenu}
          onBlur={closeMenu}
          Icon={EllipsisHorizontalIcon}
        />
        <div
          className={`absolute top-[110%] right-0 z-10 block min-w-[10rem] rounded-xl bg-white py-3 shadow-md ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <div className="py-1 px-4 hover:bg-slate-100">Save and edit</div>
          <div className="py-1 px-4 hover:bg-slate-100">Export</div>
          <div className="py-1 px-4 hover:bg-slate-100">Combine</div>
          <div className="py-1 px-4 hover:bg-slate-100">Print</div>
          <div className="py-1 px-4 hover:bg-slate-100">Delete</div>
        </div>
      </div>
    </div>
  );
};

export default StudySetCTA;
