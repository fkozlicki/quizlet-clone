import type { User } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface ProfileImageProps {
  image?: User["image"];
  userName?: User["name"];
  size: number;
  fontSize: number;
}

const ProfileImage = ({
  image,
  userName,
  size,
  fontSize,
}: ProfileImageProps) => {
  return (
    <>
      {image ? (
        <Image
          src={image}
          alt="profile image"
          width={size}
          height={size}
          className="rounded-full"
        />
      ) : (
        <div
          className="grid place-items-center rounded-full bg-slate-500 text-white"
          style={{
            width: size,
            height: size,
            fontSize,
          }}
        >
          {userName ? userName.charAt(0) : "?"}
        </div>
      )}
    </>
  );
};

export default ProfileImage;
