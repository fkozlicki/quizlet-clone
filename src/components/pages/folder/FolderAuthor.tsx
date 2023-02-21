import type { User } from "@prisma/client";
import React from "react";
import ProfileImage from "../../ProfileImage";

interface FolderInfoProps {
  setsCount: number;
  userImage: User["image"];
  userName: User["name"];
}

const FolderAuthor = ({ setsCount, userImage, userName }: FolderInfoProps) => {
  return (
    <div className="flex gap-4">
      <div>{setsCount} sets</div>
      <div className="flex gap-2">
        <span>created by</span>
        <ProfileImage
          image={userImage}
          userName={userName}
          size={20}
          fontSize={16}
        />
        <span>{userName}</span>
      </div>
    </div>
  );
};

export default FolderAuthor;
