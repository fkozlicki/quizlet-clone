import { AcademicCapIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, type MouseEvent } from "react";
import { PieChart } from "react-minimal-pie-chart";
import CardPreview from "../../../components/CardPreview";
import MultipleChoice from "../../../components/cards/MultipleChoice";
import { api } from "../../../utils/api";

const Learn = () => {
  const { query } = useRouter();
  const id = String(query.id);
  const { data: cards, isLoading } = api.studySet.getLearnSet.useQuery(
    { id },
    {
      refetchOnWindowFocus: false,
    }
  );
  const [cardIndex, setCardIndex] = useState<number>(0);
  const currentCard = cards?.[cardIndex];
  const [disabled, setDisabled] = useState<boolean>(false);
  const [correct, setCorrect] = useState<number>(0);

  const resetLearning = () => {
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-slate-100">
      <div className="m-auto max-w-[65rem] p-4 md:py-12">
        {cards && (
          <div className="mb-6 h-1 w-full rounded-full bg-gray-200">
            <div
              className={`h-1 w-1/4 rounded-full bg-gray-600 transition-[width]`}
              style={{ width: `${(cardIndex / cards.length) * 100}%` }}
            ></div>
          </div>
        )}
        <div>
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
              <div className="mb-8 flex flex-col gap-16 md:flex-row">
                <div className="flex-1">
                  <div className="mb-4 text-xl font-bold text-slate-600">
                    Your results
                  </div>
                  <div className="flex gap-4">
                    <PieChart
                      data={[{ value: correct, color: "#4ade80" }]}
                      totalValue={cards.length}
                      lineWidth={25}
                      rounded
                      startAngle={270}
                      background="#fb923c"
                      label={({ dataEntry }) => (
                        <text
                          dominantBaseline="central"
                          x="50"
                          y="50"
                          dx="0"
                          dy="0"
                          color="red"
                          textAnchor="middle"
                          className="font-medium"
                        >
                          {dataEntry.percentage}%
                        </text>
                      )}
                      labelStyle={{
                        fontWeight: "500",
                        color: "#fff",
                      }}
                      labelPosition={0}
                      style={{
                        width: "96px",
                        height: "96px",
                      }}
                    />
                    <div className="flex gap-4">
                      <div className="flex flex-col justify-evenly">
                        <div className="text-xl font-medium text-green-600">
                          Know
                        </div>
                        <div className="text-xl font-medium text-orange-600">
                          Still learning
                        </div>
                      </div>
                      <div className="flex flex-col justify-evenly">
                        <div className="rounded-full border border-green-300 bg-green-100 px-4 text-xl font-medium text-green-600">
                          {correct}
                        </div>
                        <div className="rounded-full border border-orange-300 bg-orange-100 px-4 text-xl font-medium text-orange-600">
                          {cards.length - correct}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-4 text-xl font-bold text-slate-600">
                    Next steps
                  </div>
                  <div className="flex flex-col gap-4">
                    <Link
                      href={`/study-set/${id}`}
                      className="flex gap-4 rounded-lg border-2 border-transparent bg-white p-4 shadow-md hover:border-slate-300"
                    >
                      <>
                        <AcademicCapIcon width={28} />
                        <div>Back to study set</div>
                      </>
                    </Link>
                    <button
                      onClick={resetLearning}
                      className="flex gap-4 rounded-lg border-2 border-transparent bg-white p-4 shadow-md hover:border-slate-300"
                    >
                      <ArrowPathIcon width={28} />
                      <div>Restart Learning</div>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-4 text-xl font-bold text-gray-600">
                  Terms studied in this round
                </div>
                <div className="flex max-w-3xl flex-col gap-4">
                  {cards.map(({ term, definition }, index) => (
                    <CardPreview
                      key={index}
                      term={term}
                      definition={definition}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learn;
