import { EditOutlined, StarFilled } from "@ant-design/icons";
import type { Flashcard } from "@prisma/client";
import { Button, Typography, message, theme } from "antd";
import { useSession } from "next-auth/react";
import { useFlashcardModalContext } from "../../contexts/FlashcardModalContext";
import { api } from "../../utils/api";

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

  const openEditModal = () => {
    dispatch({ type: "open", payload: flashcard });
  };

  const toggleStar = () => {
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
      className="flex flex-col gap-2 rounded p-4 drop-shadow sm:flex-row sm:items-center"
      style={{
        background: colorBgContainer,
      }}
    >
      <div className="order-2 flex justify-end gap-1">
        {userId && session && userId === session.user.id && (
          <Button
            onClick={openEditModal}
            type="text"
            size="small"
            icon={<EditOutlined />}
          />
        )}
        <Button
          onClick={toggleStar}
          type="text"
          icon={
            <StarFilled
              className={starredFlashcard ? "text-yellow-300" : undefined}
            />
          }
          size="small"
          loading={addLoading || removeLoading}
          disabled={addLoading || removeLoading}
        />
      </div>
      <div className="border-slate-200 sm:basis-2/5 sm:border-r sm:pr-8">
        <Typography.Text className="text-base">{term}</Typography.Text>
      </div>
      <div className="sm:basis-3/5 sm:px-8">
        <Typography.Text className="text-base">{definition}</Typography.Text>
      </div>
    </div>
  );
};

export default FlashcardPreview;
