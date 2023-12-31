import { EditOutlined, StarFilled } from "@ant-design/icons";
import type { Flashcard } from "@prisma/client";
import { Button, Typography, message, theme } from "antd";
import type { MouseEventHandler } from "react";
import { useFlashcardModalContext } from "../../contexts/FlashcardModalContext";
import { api } from "../../utils/api";

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
  const {
    starredFlashcard: {
      getSetCards: { setData, getData },
    },
  } = api.useUtils();
  const { mutate: addToStarred, isLoading: addLoading } =
    api.starredFlashcard.create.useMutation({
      onSuccess(data) {
        setData({ setId: flashcard.studySetId }, (oldData) => {
          if (!oldData) {
            return;
          }

          return [...oldData, data];
        });
      },
      onError: () => {
        void message.error("Couldn't add flashcard to starred");
      },
    });
  const { mutate: removeFromStarred, isLoading: removeLoading } =
    api.starredFlashcard.delete.useMutation({
      onSuccess: (data) => {
        setData({ setId: flashcard.studySetId }, (oldData) => {
          if (!oldData) {
            return;
          }

          return oldData.filter((card) => card.id !== data.id);
        });
      },
      onError: () => {
        void message.error("Couldn't remove flashcard from starred");
      },
    });
  const starredFlashcards = getData({ setId: flashcard.studySetId });

  const starredFlashcard = starredFlashcards?.find(
    (card) => card.flashcardId === flashcard.id
  );

  const handleOpenEdit: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    dispatch({ type: "open", payload: flashcard });
  };

  const toggleStar: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    if (starredFlashcard) {
      removeFromStarred({
        starredId: starredFlashcard.id,
      });
    } else {
      addToStarred({
        flashcardId: flashcard.id,
      });
    }
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
              onClick={toggleStar}
              icon={
                <StarFilled
                  className={starredFlashcard ? "text-yellow-300" : undefined}
                />
              }
              type="text"
              shape="circle"
              loading={addLoading || removeLoading}
              disabled={addLoading || removeLoading}
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
