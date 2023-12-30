import { EditOutlined, StarFilled } from "@ant-design/icons";
import type { Flashcard } from "@prisma/client";
import { Button, Typography, theme } from "antd";
import type { MouseEventHandler } from "react";
import { useFlashcardModalContext } from "../../contexts/FlashcardModalContext";

interface FlipCardContentProps {
  content: string;
  title: string;
  editable: boolean;
  back?: boolean;
  flashcard: Flashcard;
}

const FlipCardContent = ({
  content,
  title,
  editable,
  back,
  flashcard,
}: FlipCardContentProps) => {
  const [, dispatch] = useFlashcardModalContext();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleOpenEdit: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    dispatch({ type: "open", payload: flashcard });
  };

  const handleAddToFavourites: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className={`absolute h-full w-full [backface-visibility:hidden] ${
        back ? "[transform:rotateX(180deg)]" : ""
      }`}
    >
      <div
        className="flex h-full w-full flex-col rounded-lg p-4 drop-shadow-lg md:p-6"
        style={{
          background: colorBgContainer,
        }}
      >
        <div className="flex items-center justify-between">
          <Typography.Text className="select-none font-semibold">
            {title}
          </Typography.Text>
          <div className="flex justify-end gap-2">
            {editable && (
              <Button
                icon={<EditOutlined />}
                type="text"
                onClick={handleOpenEdit}
                shape="circle"
              />
            )}
            <Button
              onClick={handleAddToFavourites}
              icon={<StarFilled />}
              type="text"
              shape="circle"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Typography.Text className="select-none text-3xl">
            {content}
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};
export default FlipCardContent;
