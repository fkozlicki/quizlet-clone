"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

import type { Session } from "@acme/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Card, CardContent } from "@acme/ui/card";
import Cropper from "@acme/ui/cropper";
import { Dropzone } from "@acme/ui/dropzone";
import { Separator } from "@acme/ui/separator";

import { uploadObject } from "~/lib/aws";
import { api } from "~/trpc/react";

const profilePictures = [
  "dog.jpg",
  "frog.jpg",
  "lion.jpg",
  "monkey.jpg",
  "rabbit.jpg",
];

const EditProfilePicture = ({ user }: { user: Session["user"] }) => {
  const [image, setImage] = useState<string | undefined>(
    user.image ?? undefined,
  );
  const { mutate } = api.user.update.useMutation({
    onSuccess(data) {
      setImage(data.image ?? undefined);
    },
  });

  const updateUserImage = (image: string) => {
    mutate({
      image,
    });
  };

  const uploadAndUpdate = async (file: File) => {
    const { url } = await uploadObject(file);
    updateUserImage(url);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
      <div className="flex items-center gap-4 lg:basis-48 lg:flex-col">
        <Avatar className="h-16 w-16">
          <AvatarImage src={image} alt="user avatar" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <span className="text-xl font-semibold">Profile Picture</span>
      </div>
      <Card className="flex-1">
        <CardContent className="p-6">
          <span className="mb-4 inline-block text-base font-bold">
            Choose your profile picture
          </span>
          <div className="flex flex-wrap gap-2">
            {profilePictures.map((picture) => (
              <Image
                key={picture}
                onClick={() => updateUserImage(`/images/${picture}`)}
                src={`/images/${picture}`}
                alt=""
                width={48}
                height={48}
                className="cursor-pointer rounded-full border"
              />
            ))}
          </div>
          <Separator className="my-6" />
          <Cropper aspect={1 / 1} afterCrop={uploadAndUpdate}>
            <Dropzone />
          </Cropper>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfilePicture;
