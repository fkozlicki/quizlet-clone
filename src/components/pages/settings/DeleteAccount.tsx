import { XMarkIcon } from "@heroicons/react/24/solid";
import type { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import { api } from "../../../utils/api";
import ProfileImage from "../../ProfileImage";

interface DeleteAccountProps {
  image: User["image"];
  userName: User["name"];
}

const DeleteAccount = ({ userName, image }: DeleteAccountProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const deleteMutation = api.user.delete.useMutation();

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    deleteMutation.mutate();
    await signOut();
  };

  return (
    <div className="relative mb-8 flex flex-col lg:flex-row lg:items-center lg:gap-8">
      <div className="mb-2 flex items-center gap-2 lg:basis-48 lg:flex-col lg:justify-center">
        <XMarkIcon width={32} height={32} />
        <p className="text-xl font-semibold">Delete Account</p>
      </div>
      <div className="flex-1 rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Permanently delete {userName}
        </h2>
        <p className="mb-8">
          Be careful - this will delete all your data and connot be undone.
        </p>
        <button
          onClick={openModal}
          className="rounded bg-red-400 px-4 py-2 font-medium text-white hover:bg-red-300"
        >
          Delete Account
        </button>
      </div>
      <div
        className={`fixed left-0 top-0 z-30 grid h-screen w-screen place-items-center bg-black/50 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div className="relative rounded-lg bg-white p-8">
          <button onClick={closeModal} className="absolute right-4 top-4">
            <XMarkIcon width={24} />
          </button>
          <div className="mb-4 text-3xl font-semibold">Delete Account</div>
          <p className="mb-4 text-lg">
            Are you sure you want to delete account:
          </p>
          <div className="mb-8 flex items-center gap-4">
            <ProfileImage
              image={image}
              userName={userName}
              size={32}
              fontSize={16}
            />
            <span className="font-medium">{userName}</span>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
