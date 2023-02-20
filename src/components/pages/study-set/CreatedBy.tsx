import type { User } from "@prisma/client";
import React from "react";
import ProfileImage from "../../ProfileImage";

interface CreatedByProps {
  userImage: User["image"];
  userName: User["name"];
}

const CreatedBy = ({ userImage, userName }: CreatedByProps) => {
  return (
    <div className="mb-10 flex items-center gap-4">
      <ProfileImage
        image={userImage}
        userName={userName}
        size={32}
        fontSize={16}
      />
      <div>
        <p className="text-xs text-gray-400">Created by</p>
        <p className="text-sm font-medium">{userName}</p>
      </div>
    </div>
  );
};

export default CreatedBy;
