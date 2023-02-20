import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";

interface CreateFolderProps {
  closeCreateFolder: () => void;
  isOpen: boolean;
}

const CreateFolder = ({ closeCreateFolder, isOpen }: CreateFolderProps) => {
  return (
    <div
      className={`fixed top-0 left-0 z-30 grid h-screen w-screen place-items-center bg-gray-800/50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div>
        <div className="bg-white p-4 sm:min-w-[600px]">
          <div className="flex justify-end">
            <button onClick={closeCreateFolder} className="block">
              <XMarkIcon width={24} />
            </button>
          </div>
          <h1 className="mb-8 text-3xl font-bold">Create a new folder</h1>
          <form className="flex flex-col gap-3">
            <input
              type="text w-full"
              className="rounded-md bg-slate-100 py-2 px-4 font-medium outline-none placeholder:text-base placeholder:font-medium placeholder:text-slate-500"
              placeholder="Enter a title"
            />
            <input
              type="text"
              className="rounded-md bg-slate-100 py-2 px-4 font-medium outline-none placeholder:font-medium placeholder:text-slate-500"
              placeholder="Enter a description (optional)"
            />
          </form>
        </div>
        <div className="flex justify-end border-t bg-white p-4">
          <button
            disabled={true}
            className="rounded-md px-4 py-2 font-medium text-white disabled:bg-slate-300"
          >
            Create folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolder;
