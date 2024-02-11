"use client";

import { api } from "@/trpc/react";
import { EditOutlined, StarFilled } from "@ant-design/icons";
import type { Flashcard } from "@prisma/client";
import { Button, message, theme } from "antd";
import Text from "antd/es/typography/Text";
import { useSession } from "next-auth/react";
import { useFlashcardModalContext } from "../../contexts/FlashcardModalContext";

interface CardPreviewProps {
  flashcard: Flashcard & { starred?: boolean };
  userId?: string;
}

const FlashcardPreview = ({ flashcard, userId }: CardPreviewProps) => {
  const { data: session } = useSession();
  const { term, definition } = flashcard;
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
            oldCard.id === flashcardId
              ? { ...oldCard, starred: true }
              : oldCard,
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
                : oldCard,
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
    },
  );

  const openEditModal = () => {
    dispatch({ type: "open", payload: flashcard });
  };

  const toggleStar = () => {
    if (flashcard?.starred) {
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
              className={flashcard?.starred ? "text-yellow-300" : undefined}
            />
          }
          size="small"
        />
      </div>
      <div className="border-slate-200 sm:basis-2/5 sm:border-r sm:pr-8">
        <Text className="text-base">{term}</Text>
      </div>
      <div className="sm:basis-3/5 sm:px-8">
        <Text className="text-base">{definition}</Text>
      </div>
    </div>
  );
};

export default FlashcardPreview;
