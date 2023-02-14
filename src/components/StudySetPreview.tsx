import type { StudySet, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
            {authorImage ? (
              <Image
                src={authorImage}
                alt="author icon"
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-slate-600 uppercase text-white">
                {authorName?.charAt(0)}
              </div>
            )}
            <span>{authorName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySetPreview;
