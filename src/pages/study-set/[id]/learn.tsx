import { ArrowPathIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Progress } from "antd";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState, type MouseEvent } from "react";
import CardPreview from "../../../components/CardPreview";
import Result from "../../../components/Result";
import MultipleChoice from "../../../components/cards/MultipleChoice";
import { api } from "../../../utils/api";

const Learn = () => {
  const { query, push } = useRouter();
  const setId = query.id?.toString();
  const {
    data: cards,
    isLoading,
    refetch,
    isError,
  } = api.studySet.getLearnSet.useQuery(
    { id: setId! },
    {
      refetchOnWindowFocus: false,
      enabled: !!setId,
    }
  );
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [correct, setCorrect] = useState<number>(0);

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

  if (isLoading || !setId) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  const currentCard = cards[cardIndex];

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
        <div>
          <div className="mb-8 text-2xl font-bold">U finished learning</div>
          <Result
            hard={cards.length - correct}
            cardCount={cards.length}
            firstButton={{
              text: "Lear with new set",
              Icon: <ArrowPathIcon className="h-6 w-6" />,
              callback: resetLearning,
              description: "Essa",
            }}
            secondButton={{
              text: "Back to study set",
              Icon: <ArrowUturnLeftIcon className="h-6 w-6" />,
              callback: backToStudySet,
              description: "essa",
            }}
          />
          <div>
            <div className="mb-4 text-xl font-bold text-gray-600">
              Terms studied in this round
            </div>
            <div className="flex flex-col gap-4">
              {cards.map((flashcard, index) => (
                <CardPreview key={index} flashcard={flashcard} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Learn;
