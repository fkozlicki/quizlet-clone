import { useSession } from "next-auth/react";
import React from "react";

interface EmptyFolderProps {
  openAddSetModal: () => void;
}

const EmptyFolder = ({ openAddSetModal }: EmptyFolderProps) => {
  const { data: session } = useSession();

  return (
    <div className="p-12 text-center">
      {session ? (
        <div>
          <h2 className="text-3xl font-semibold">
            This folder has no sets yet
          </h2>
          <p className="mb-6 text-lg">
            Organize all your study sets with folders.
          </p>
          <button
            onClick={openAddSetModal}
            className="rounded bg-cyan-400 px-4 py-2 font-medium text-white hover:bg-cyan-500"
          >
            Add a set
          </button>
        </div>
      ) : (
        <h2>This folder does not yet contain any sets.</h2>
      )}
    </div>
  );
};

export default EmptyFolder;
