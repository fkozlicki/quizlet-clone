import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import pictures from "../../../data/pictures.json";
import { api } from "../../../utils/api";
import ProfileImage from "../../ProfileImage";

interface EditProfilePictureProps {
  image: User["image"];
  userName: User["name"];
}

const editPictureSchema = z.object({
  files: typeof window === "undefined" ? z.null() : z.instanceof(FileList),
});

type EditPictureInputs = z.infer<typeof editPictureSchema>;

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkg9zehpc/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "quizletv2";

const EditProfilePicture = ({ image, userName }: EditProfilePictureProps) => {
  const submitButton = useRef<HTMLButtonElement>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EditPictureInputs>({
    resolver: zodResolver(editPictureSchema),
    defaultValues: {},
  });
  const [picture, setPicture] = useState<User["image"]>(image);
  const pictureMutation = api.user.editPicture.useMutation({
    onSuccess: ({ image }) => {
      setPicture(image);
      toast("Updated profile picture");
    },
    onError: () => {
      toast("Couldn't update profile picture");
    },
  });
  const uploadToCloudinary = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: data,
      });
      return res.json() as Promise<{ secure_url: string }>;
    },
    onSuccess: (data) => {
      updatePicture(data.secure_url);
    },
    onError: () => {
      toast("Couldn't update profile picture");
    },
  });

  const updatePicture = (image: string) => {
    pictureMutation.mutate({ image });
  };

  const uploadPicture = (data: EditPictureInputs) => {
    const newFile = data.files?.[0];
    const formData = new FormData();
    formData.append("file", newFile!);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    uploadToCloudinary.mutate(formData);
  };

  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:gap-8">
      <div className="mb-4 flex items-center gap-4 lg:basis-48 lg:flex-col">
        <ProfileImage
          image={picture}
          userName={userName}
          size={64}
          fontSize={20}
        />
        <div className="text-xl font-semibold">Profile Picture</div>
      </div>
      <div className="flex-1 rounded-lg bg-white p-4 shadow">
        <div>Choose your profile picture</div>
        <div className="flex flex-wrap gap-2">
          {pictures.map((picture, index) => (
            <button
              onClick={() => updatePicture(`/profile/${picture}`)}
              key={index}
            >
              <Image
                src={`/profile/${picture}`}
                alt=""
                width={48}
                height={48}
                className="rounded-full border"
              />
            </button>
          ))}
        </div>
        <div className="mb-4 flex items-center">
          <div className="h-px flex-1 bg-gradient-to-l from-slate-300" />
          <div className="mx-2">or</div>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-300" />
        </div>
        <form onSubmit={handleSubmit(uploadPicture)}>
          <label
            htmlFor="profile-picture"
            className="m-auto block w-max cursor-pointer rounded-md bg-cyan-400 px-4 py-2 font-medium text-white hover:bg-cyan-500"
          >
            Upload your own picture
            <input
              {...register("files", {
                onChange: () => submitButton.current?.click(),
              })}
              type="file"
              id="profile-picture"
              className="hidden"
            />
          </label>
          <button type="submit" ref={submitButton} className="hidden" />
          {errors.files && <p>{errors.files.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditProfilePicture;
