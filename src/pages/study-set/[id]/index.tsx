import {
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import CardPreview from "../../../components/CardPreview";
import FlippingCard from "../../../components/FlippingCard";
import IconButton from "../../../components/IconButton";
import IconCard from "../../../components/IconCard";
import StudySetPreview from "../../../components/StudySetPreview";
import { api } from "../../../utils/api";

const StudySet = () => {
  const { query } = useRouter();
  const setId = query.id?.toString();
  const {
    data: studySet,
    isLoading,
    refetch,
  } = api.studySet.getById.useQuery(
    {
      id: setId!,
    },
    {
      enabled: !!query.id,
    }
  );
  const otherSets = studySet?.user.studySets;
  const cards = studySet?.cards;
  const [cardIndex, setCardIndex] = useState<number>(0);
  const currentCard = cards?.[cardIndex];
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const changeCard = (value: number) => {
    setCardIndex((prev) => prev + value);
  };

  const resetFlashcards = () => {
    setCardIndex(0);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="overflow-hidden bg-slate-100">
      <div className="m-auto max-w-[55rem] p-4 sm:p-10">
        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">
          {studySet?.title}
        </h1>
        {cards && (
          <div className="mb-6 h-1 w-full rounded-full bg-gray-200">
            <div
              className={`h-1 w-1/4 rounded-full bg-gray-600 transition-[width]`}
              style={{ width: `${(cardIndex / cards.length) * 100}%` }}
            ></div>
          </div>
        )}
        <div className="mb-12">
          {cards && currentCard && (
            <FlippingCard
              variant="normal"
              buttonVariant="chevron"
              refetchSet={refetch}
              id={currentCard.id}
              userId={studySet.userId}
              term={currentCard.term}
              definition={currentCard.definition}
              index={cardIndex}
              length={cards.length}
              changeCardCallback={changeCard}
            />
          )}
          {cards && cardIndex === cards.length && (
            <div>
              <div className="mb-6 text-3xl font-bold">
                You&apos;ve reviewed all the cards.
              </div>
              <div className="flex gap-6">
                <div className="flex flex-1 gap-4">
                  <PieChart
                    data={[{ value: 1, color: "#4ade80" }]}
                    totalValue={1}
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
                        {studySet.cards.length}
                      </div>
                      <div className="rounded-full border border-orange-300 bg-orange-100 px-4 text-xl font-medium text-orange-600">
                        {0}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <button
                    className="w-full rounded-md bg-white p-3 font-medium shadow-md"
                    onClick={resetFlashcards}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {setId && (
          <div className="mb-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <IconCard
              icon="/cards.png"
              text="Flashcards"
              link={`${setId}/flashcards`}
            />
            <IconCard icon="/study.png" text="Learn" link={`${setId}/learn`} />
            <IconCard icon="/file.png" text="Test" link={`${setId}/test`} />
            <IconCard icon="/puzzle.png" text="Match" link={`${setId}/match`} />
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-10 flex items-center gap-4">
            {studySet?.user.image ? (
              <Image
                src={studySet?.user.image}
                alt="author image"
                width={50}
                height={50}
                className="rounded-full"
              />
            ) : (
              <div className="h-8 w-8 bg-slate-400 text-white">
                {studySet?.user.name?.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400">Created by</p>
              <p className="text-sm font-medium">{studySet?.user.name}</p>
            </div>
          </div>
          <div className="mb-10 flex gap-2">
            <IconButton Icon={PlusIcon} size={20} />
            {session?.user?.id === studySet?.userId && (
              <IconButton
                Icon={PencilIcon}
                size={18}
                as="link"
                href={`${setId!}/edit`}
              />
            )}
            <IconButton Icon={ArrowUpTrayIcon} size={20} />
            <div className="relative">
              <IconButton
                size={20}
                onClick={toggleMenu}
                onBlur={closeMenu}
                Icon={EllipsisHorizontalIcon}
              />
              <div
                className={`absolute top-[110%] right-0 z-10 block min-w-[10rem] rounded-xl bg-white py-3 shadow-md ${
                  menuOpen ? "block" : "hidden"
                }`}
              >
                <div className="py-1 px-4 hover:bg-slate-100">
                  Save and edit
                </div>
                <div className="py-1 px-4 hover:bg-slate-100">Export</div>
                <div className="py-1 px-4 hover:bg-slate-100">Combine</div>
                <div className="py-1 px-4 hover:bg-slate-100">Print</div>
                <div className="py-1 px-4 hover:bg-slate-100">Delete</div>
              </div>
            </div>
          </div>
        </div>
        {cards && (
          <div className="mb-12">
            <p className="mb-5 text-lg font-bold">
              Terms in this set ({cards.length})
            </p>
            <div className="mb-8 flex flex-col gap-3">
              {cards.map((card, index) => (
                <CardPreview
                  key={index}
                  term={card.term}
                  definition={card.definition}
                />
              ))}
            </div>
            <Link
              href={`${setId!}/edit`}
              className="m-auto block w-fit rounded-lg bg-blue-700 px-8 py-5 font-medium text-white hover:bg-blue-800"
            >
              Add or Remove Terms
            </Link>
          </div>
        )}
        {otherSets && (
          <div>
            <p className="mb-6 font-bold">Other sets by this creator</p>
            <div className="grid gap-4 md:grid-cols-2">
              {otherSets.map((set) => (
                <StudySetPreview
                  key={set.id}
                  title={set.title}
                  authorImage={set.user.image}
                  authorName={set.user.name}
                  id={set.id}
                  termsCount={set.cards.length}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySet;
