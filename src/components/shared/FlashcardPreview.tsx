import { EditOutlined, StarFilled } from "@ant-design/icons";
import type { Flashcard } from "@prisma/client";
import { Button, Typography, theme } from "antd";
import { useSession } from "next-auth/react";
import { useFlashcardModalContext } from "../../contexts/FlashcardModalContext";

interface CardPreviewProps {
  flashcard: Flashcard;
  userId?: string;
}

const FlashcardPreview = ({ flashcard, userId }: CardPreviewProps) => {
  const { data: session } = useSession();
  const { term, definition } = flashcard;
  const [, dispatch] = useFlashcardModalContext();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const openEditModal = () => {
    dispatch({ type: "open", payload: flashcard });
  };

  return (
    <div
      className="flex flex-col gap-4 rounded p-4 drop-shadow sm:flex-row sm:items-center"
      style={{
        background: colorBgContainer,
      }}
    >
      <div className="order-2 flex justify-end gap-1">
        {userId && session && userId === session.user.id && (
          <Button onClick={openEditModal} type="text" icon={<EditOutlined />} />
        )}
        <Button type="text" icon={<StarFilled />} />
      </div>
      <div className="border-slate-200 sm:basis-2/5 sm:border-r sm:pr-8">
        <Typography.Text className="font-semibold">{term}</Typography.Text>
      </div>
      <div className="sm:basis-3/5 sm:px-8">
        <Typography.Text className="font-semibold">
          {definition}
        </Typography.Text>
      </div>
    </div>
  );
};

export default FlashcardPreview;
