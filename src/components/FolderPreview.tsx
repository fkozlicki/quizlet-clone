import { FolderOutlined } from "@ant-design/icons";
import Link from "next/link";
import React from "react";

interface FolderPreviewProps {
  setsCount: number;
  title: string;
  href: string;
}

const FolderPreview = ({ title, setsCount, href }: FolderPreviewProps) => {
  return (
    <Link href={href} className="w-full rounded bg-white px-6 py-2 shadow-md">
      <div className="mb-1 font-medium">{setsCount} sets</div>
      <div className="flex items-center gap-6">
        <FolderOutlined className="text-2xl" />
        <div className="text-xl font-bold">{title}</div>
      </div>
    </Link>
  );
};

export default FolderPreview;
