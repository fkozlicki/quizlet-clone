import { UserOutlined } from "@ant-design/icons";
import type { StudySet, User } from "@prisma/client";
import { Avatar, Card, Tag } from "antd";
import Link from "next/link";

interface StudySetPreviewProps {
  id: StudySet["id"];
  title: StudySet["title"];
  termsCount: number;
  authorImage: User["image"];
  authorName: User["name"];
  authorId: User["id"];
}

const StudySetPreview = ({
  id,
  title,
  termsCount,
  authorImage,
  authorName,
  authorId,
}: StudySetPreviewProps) => {
  return (
    <Card hoverable className="relative">
      <Link
        href={`/study-set/${id}`}
        className="absolute left-0 top-0 h-full w-full"
      ></Link>
      <Card.Meta title={title} />
      <Tag className="mt-2">{termsCount} terms</Tag>
      <Link
        href={`/${authorId}`}
        className="group relative z-10 mt-8 flex w-fit items-center gap-2 text-black"
      >
        <Avatar
          size="small"
          icon={<UserOutlined />}
          src={authorImage}
          alt="set author avatar"
        />
        <span className="group-hover:underline">{authorName}</span>
      </Link>
    </Card>
  );
};

export default StudySetPreview;
