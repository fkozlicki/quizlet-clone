import { EditOutlined, StarFilled } from "@ant-design/icons";
import type { Flashcard } from "@prisma/client";
import { Button } from "antd";
import { useSession } from "next-auth/react";

interface CardPreviewProps {
  flashcard: Flashcard;
  openEditModal: () => void;
  userId: string;
}

const CardPreview = ({
  flashcard,
  openEditModal,
  userId,
}: CardPreviewProps) => {
  const { data: session } = useSession();
  const { term, definition } = flashcard;

  return (
    <div className="flex flex-col gap-4 rounded bg-white p-4 drop-shadow sm:flex-row sm:items-center">
      <div className="order-2 flex justify-end gap-1">
        {userId === session?.user.id && (
          <Button onClick={openEditModal} type="text" icon={<EditOutlined />} />
        )}
        <Button type="text" icon={<StarFilled />} />
      </div>
      <div className="border-slate-200 sm:basis-2/5 sm:border-r sm:pr-8">
        {term}
      </div>
      <div className="sm:basis-3/5 sm:px-8">{definition}</div>
    </div>
  );
};

export default CardPreview;
