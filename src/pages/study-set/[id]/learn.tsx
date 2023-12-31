import { ReloadOutlined, RollbackOutlined } from "@ant-design/icons";
import { Divider, Progress, Typography, theme } from "antd";
import type { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState, type MouseEvent } from "react";
import FlashcardPreview from "../../../components/shared/FlashcardPreview";
import MultipleChoice from "../../../components/shared/MultipleChoice";
import { generateSSGHelper } from "../../../server/helpers/ssgHelper";
import { api } from "../../../utils/api";
import StudyModeResult from "../../../components/shared/StudyModeResult";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = generateSSGHelper();
  const setId = context.query?.id;

  if (typeof setId !== "string") {
    throw new Error("No setId");
  }

  await ssg.studySet.getLearnSet.prefetch({ id: setId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      setId,
    },
  };
};

const Learn = ({ setId }: { setId: string }) => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const { data: cards, refetch } = api.studySet.getLearnSet.useQuery(
    {
      id: setId,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: starredFlashcards } = api.starredFlashcard.getSetCards.useQuery(
    {
      setId,
    },
    {
      enabled: !!session,
    }
  );
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [correct, setCorrect] = useState<number>(0);
  const {
    token: { green1, green5, red1, red5, colorBorder },
  } = theme.useToken();

  if (!cards) {
    return <div>404</div>;
  }

  const currentCard = cards[cardIndex];

  const resetLearning = async () => {
    await refetch();
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

  const backToStudySet = async () => {
    await push(`/study-set/${setId}`);
  };

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Learn" />
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
              <Typography.Title level={4} className="mb-4 text-xl font-bold">
                Terms studied in this round
              </Typography.Title>
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

export default Learn;
