import { ReloadOutlined, RollbackOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import type { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState, type MouseEvent } from "react";
import FlashcardPreview from "../../../components/shared/FlashcardPreview";
import MultipleChoice from "../../../components/shared/MultipleChoice";
import { generateSSGHelper } from "../../../server/helpers/ssgHelper";
import { api } from "../../../utils/api";
import StudyModeResult from "../../../components/shared/StudyModeResult";

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
  const { push } = useRouter();
  const { data: cards, refetch } = api.studySet.getLearnSet.useQuery({
    id: setId,
  });
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [correct, setCorrect] = useState<number>(0);

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
    if (disabled) return;
    const button = event.target as HTMLDivElement;
    const selectedAnswer = currentCard?.answers[index];
    if (!selectedAnswer) return;

    let borderColor: string;
    let backgroundColor: string;

    if (selectedAnswer === currentCard.definition) {
      borderColor = "border-green-500";
      backgroundColor = "bg-green-50";
      setCorrect((prev) => prev + 1);
    } else {
      borderColor = "border-red-500";
      backgroundColor = "bg-red-50";
    }
    setDisabled(true);
    button.classList.add(borderColor, backgroundColor);

    setTimeout(() => {
      setDisabled(false);
      button.classList.remove(borderColor, backgroundColor);
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
              Icon: <ReloadOutlined className="text-2xl" />,
              callback: resetLearning,
            }}
            secondButton={{
              text: "Back to study set",
              description: "Back to study set",
              Icon: <RollbackOutlined className="text-2xl" />,
              callback: backToStudySet,
            }}
          />
          <div>
            <div className="mb-4 text-xl font-bold text-gray-600">
              Terms studied in this round
            </div>
            <div className="flex flex-col gap-4">
              {cards.map((flashcard, index) => (
                <FlashcardPreview key={index} flashcard={flashcard} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Learn;
