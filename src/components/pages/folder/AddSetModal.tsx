import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { StudySet } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import { api } from "../../../utils/api";

interface AddSetModalProps {
  closeModal: () => void;
  folderId: string;
  refetch: () => void;
  setsInFolder: StudySet[];
}

const AddSetModal = ({
  closeModal,
  folderId,
  refetch,
  setsInFolder,
}: AddSetModalProps) => {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: studySets } = api.studySet.getUserSets.useQuery({
    id,
  });
  const { mutate: addSet } = api.folder.addSet.useMutation({
    onSuccess: () => {
      toast("Successfully added set");
      refetch();
    },
    onError: () => {
      toast("Couldn't add set");
    },
  });
  const { mutate: removeSet } = api.folder.removeSet.useMutation({
    onSuccess: () => {
      toast("Successfully removed set");
      refetch();
    },
    onError: () => {
      toast("Couldn't remove set");
    },
  });
  const setsIds = setsInFolder.map((set) => set.id);

  const handleAddSet = (setId: string) => {
    addSet({
      setId,
      folderId,
    });
  };

  const handleRemoveSet = (setId: string) => {
    removeSet({
      setId,
      folderId,
    });
  };

  return (
    <div className="fixed top-0 left-0 z-30 grid h-screen w-screen place-items-center bg-black/30">
      <div className="min-w-[350px] sm:min-w-[600px]">
        <div className="bg-blue-800 p-6">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-white">Add a set</h1>
            <button
              onClick={closeModal}
              className="grid h-10 w-10 place-items-center rounded-full border-[3px] border-blue-900 text-white hover:bg-blue-900"
            >
              <XMarkIcon width={24} />
            </button>
          </div>
        </div>
        <div className="bg-slate-200 p-8">
          <Link
            href="/create-set"
            className="group mb-6 flex w-full justify-center bg-white p-6"
          >
            <div className="">
              <div className="mb-2 font-semibold uppercase group-hover:text-yellow-500">
                + create a new set
              </div>
              <div className="h-[5px] w-full bg-cyan-500 group-hover:bg-yellow-500"></div>
            </div>
          </Link>
          <div className="flex flex-col gap-4">
            {studySets?.map(({ title, id }) => (
              <div
                key={id}
                className="flex items-center justify-between rounded bg-white p-4"
              >
                <h2 className="text-xl font-bold">{title}</h2>
                {setsIds.includes(id) ? (
                  <button
                    onClick={() => handleRemoveSet(id)}
                    className="group rounded border-2 border-yellow-500 bg-yellow-500 px-4 py-2"
                  >
                    <MinusIcon width={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddSet(id)}
                    className="group rounded border-2 border-slate-300 px-4 py-2"
                  >
                    <PlusIcon
                      width={20}
                      className="text-cyan-500 group-hover:text-yellow-500"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSetModal;
