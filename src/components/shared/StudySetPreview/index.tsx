import { UserOutlined } from "@ant-design/icons";
import type { StudySet, User } from "@prisma/client";
import { Avatar, Card, Tag } from "antd";
import Meta from "antd/es/card/Meta";
import Text from "antd/es/typography/Text";
import Image from "next/image";
import Link from "next/link";

interface StudySetPreviewProps {
  studySet: StudySet & {
    user: Pick<User, "id" | "image" | "name">;
    _count: { cards: number };
  };
}

const StudySetPreview = ({ studySet }: StudySetPreviewProps) => {
  const {
    id,
    title,
    _count: { cards: termsCount },
    user: { id: authorId, image: authorImage, name: authorName },
  } = studySet;

  return (
    <Card hoverable className="relative">
      <Link
        href={`/study-set/${id}`}
        className="absolute left-0 top-0 h-full w-full"
      ></Link>
      <Meta title={title} />
      <Tag className="mt-2">{termsCount} terms</Tag>
      <Link
        href={`/${authorId}`}
        className="group relative z-10 mt-8 flex w-fit items-center gap-2 text-black"
      >
        <Avatar
          size="small"
          icon={<UserOutlined />}
          src={
            authorImage ? (
              <Image src={authorImage} alt="" width={22} height={22} />
            ) : undefined
          }
          alt="set author avatar"
        />
        <Text className="group-hover:underline">{authorName}</Text>
      </Link>
    </Card>
  );
};

export default StudySetPreview;
