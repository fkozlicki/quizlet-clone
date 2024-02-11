"use client";

import { api } from "@/trpc/react";
import { Divider, Progress, theme } from "antd";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import FlashcardPreview from "./shared/FlashcardPreview";
import MultipleChoice from "./shared/MultipleChoice";
import StudyModeResult from "./shared/StudyModeResult";
import { ReloadOutlined, RollbackOutlined } from "@ant-design/icons";
import { type Flashcard, type StarredFlashcard } from "@prisma/client";

type LearnCard = {
  answers: string[];
  id: string;
  term: string;
  definition: string;
  studySetId: string;
  position: number;
};

const LearnGame = ({
  cards,
  starredFlashcards,
  setId,
}: {
  cards: LearnCard[];
  starredFlashcards: (StarredFlashcard & { flashcard: Flashcard })[];
  setId: string;
}) => {
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [correct, setCorrect] = useState<number>(0);
  const {
    token: { green1, green5, red1, red5, colorBorder },
  } = theme.useToken();
  const utils = api.useUtils();
  const router = useRouter();

  const currentCard = cards[cardIndex];

  const resetLearning = async () => {
    await utils.studySet.getLearnSet.invalidate();
    setCardIndex(0);
    setCorrect(0);
  };

  const chooseAnswer = (index: number, event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (disabled) return;
    const button = event.currentTarget as HTMLDivElement;
    const selectedAnswer = currentCard?.answers[index];
    if (!selectedAnswer) return;

    let borderColor: string;
    let backgroundColor: string;

    if (selectedAnswer === currentCard.definition) {
      borderColor = green5;
      backgroundColor = green1;
      setCorrect((prev) => prev + 1);
    } else {
      borderColor = red5;
      backgroundColor = red1;
    }
    setDisabled(true);
    button.style.background = backgroundColor;
    button.style.borderColor = borderColor;

    setTimeout(() => {
      button.style.background = "";
      button.style.borderColor = colorBorder;
      setDisabled(false);
      setCardIndex((prev) => prev + 1);
    }, 1000);
  };

  const backToStudySet = () => {
    router.push(`/study-set/${setId}`);
  };

  return (
    <>
      <Progress
        percent={(cardIndex / cards.length) * 100}
        size="small"
        showInfo={false}
      />
      {currentCard && (
        <MultipleChoice
          term={currentCard.term}
          answers={currentCard.answers}
          index={cardIndex}
          callback={chooseAnswer}
          type="button"
        />
      )}
      {cards && cardIndex === cards.length && (
        <>
          <div className="mb-8 text-2xl font-bold">U finished learning</div>
          <StudyModeResult
            hard={cards.length - correct}
            cardCount={cards.length}
            firstButton={{
              text: "Learn with new set",
              description: "Learn with new set",
              Icon: <ReloadOutlined className="text-4xl" />,
              callback: resetLearning,
            }}
            secondButton={{
              text: "Back to study set",
              description: "Back to study set",
              Icon: <RollbackOutlined className="text-4xl" />,
              callback: backToStudySet,
            }}
          />
          <Divider className="my-4 md:my-8" />
          {starredFlashcards && (
            <div>
              <Title level={4} className="mb-4 text-xl font-bold">
                Terms studied in this round
              </Title>
              <div className="flex flex-col gap-4">
                {cards.map((flashcard, index) => (
                  <FlashcardPreview key={index} flashcard={flashcard} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LearnGame;
