import { FolderOutlined } from "@ant-design/icons";
import { Card, Tag } from "antd";
import Link from "next/link";
import React from "react";

interface FolderPreviewProps {
  setsCount: number;
  title: string;
  href: string;
}

const FolderPreview = ({ title, setsCount, href }: FolderPreviewProps) => {
  return (
    <Link href={href}>
      <Card hoverable className="[&>div]:p-4">
        <Tag className="mb-3">{setsCount} sets</Tag>
        <div className="flex items-center gap-2">
          <FolderOutlined className="mb-1 text-2xl" />
          <div className="text-xl font-bold">{title}</div>
        </div>
      </Card>
    </Link>
  );
};

export default FolderPreview;
