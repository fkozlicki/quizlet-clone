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
  flashcard: Flashcard & { starred?: boolean };
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
  const utils = api.useUtils();
  const { mutate: addToStarred } = api.starredFlashcard.create.useMutation({
    onMutate({ flashcardId }) {
      const prevData = utils.studySet.getById.getData({
        id: flashcard.studySetId,
      });

      utils.studySet.getById.setData({ id: flashcard.studySetId }, (old) => {
        if (!old) {
          return;
        }
        return {
          ...old,
          cards: old.cards.map((oldCard) =>
            oldCard.id === flashcardId ? { ...oldCard, starred: true } : oldCard
          ),
        };
      });

      return {
        prevData,
      };
    },
    onSettled: async () => {
      return await utils.studySet.invalidate();
    },
    onError: () => {
      void message.error("Couldn't add flashcard to starred");
    },
  });
  const { mutate: removeFromStarred } = api.starredFlashcard.delete.useMutation(
    {
      onMutate({ flashcardId }) {
        const prevData = utils.studySet.getById.getData({
          id: flashcard.studySetId,
        });

        utils.studySet.getById.setData({ id: flashcard.studySetId }, (old) => {
          if (!old) {
            return;
          }
          return {
            ...old,
            cards: old.cards.map((oldCard) =>
              oldCard.id === flashcardId
                ? { ...oldCard, starred: false }
                : oldCard
            ),
          };
        });

        return {
          prevData,
        };
      },
      onError: () => {
        void message.error("Couldn't remove flashcard from starred");
      },
    }
  );

  const handleOpenEdit: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    dispatch({ type: "open", payload: flashcard });
  };

  const toggleStar: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    if (flashcard.starred) {
      removeFromStarred({
        flashcardId: flashcard.id,
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
                  className={flashcard.starred ? "text-yellow-300" : undefined}
                />
              }
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
