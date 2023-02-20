import type { StudySet, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProfileImage from "./ProfileImage";

interface StudySetPreviewProps {
  id: StudySet["id"];
  title: StudySet["title"];
  termsCount: number;
  authorImage: User["image"];
  authorName: User["name"];
}

const StudySetPreview = ({
  id,
  title,
  termsCount,
  authorImage,
  authorName,
}: StudySetPreviewProps) => {
  return (
    <div className="relative overflow-hidden rounded bg-white drop-shadow">
      <Link
        className="absolute top-0 left-0 h-full w-full border-b-[5px] border-white hover:border-gray-300"
        href={`/study-set/${id}`}
      ></Link>
      <div className="py-3 px-4">
        <div className="flex h-32 flex-col justify-between">
          <div>
            <p>{title}</p>
            <p>{termsCount} terms</p>
          </div>
          <div className="flex items-center gap-2">
            <ProfileImage
              image={authorImage}
              userName={authorName}
              size={24}
              fontSize={14}
            />
            <span>{authorName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySetPreview;
