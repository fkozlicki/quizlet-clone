import { useRouter } from "next/router";
import React, { useState } from "react";
import FlippingCard from "../../../components/FlippingCard";
import CardsList from "../../../components/pages/study-set/CardsList";
import CreatedBy from "../../../components/pages/study-set/CreatedBy";
import OtherSets from "../../../components/pages/study-set/OtherSets";
import StudyModes from "../../../components/pages/study-set/StudyModes";
import StudySetCTA from "../../../components/pages/study-set/StudySetCTA";
import ProgressBar from "../../../components/ProgressBar";
import Result from "../../../components/Result";
import { api } from "../../../utils/api";

const StudySet = () => {
  const { query } = useRouter();
  const setId = query.id?.toString();
  const {
    data: studySet,
    isLoading,
    refetch,
    error,
  } = api.studySet.getById.useQuery(
    {
      id: setId!,
    },
    {
      enabled: !!query.id,
    }
  );
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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

  if (isLoading || !setId) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  const currentCard = studySet.cards?.[cardIndex];
  const otherSets = studySet.user.studySets;
  const {
    cards,
    userId,
    user: { image, name },
  } = studySet;

  return (
    <div className="overflow-hidden bg-slate-100">
      <div className="m-auto max-w-[55rem] p-4 sm:p-10">
        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">
          {studySet.title}
        </h1>
        {studySet.description && (
          <p className="mb-8 text-lg">{studySet.description}</p>
        )}
        <ProgressBar value={cardIndex} max={cards.length} />
        <div className="mb-12">
          {currentCard && (
            <FlippingCard
              variant="normal"
              buttonVariant="chevron"
              refetchSet={refetch}
              id={currentCard.id}
              userId={userId}
              term={currentCard.term}
              definition={currentCard.definition}
              index={cardIndex}
              length={cards.length}
              changeCardCallback={changeCard}
            />
          )}
          {cardIndex === cards.length && (
            <Result know={cards.length} learning={0} studySetId={setId} />
          )}
        </div>
        <StudyModes setId={setId} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CreatedBy userImage={image} userName={name} />
          <StudySetCTA
            userId={userId}
            setId={setId}
            closeMenu={closeMenu}
            menuOpen={menuOpen}
            toggleMenu={toggleMenu}
          />
        </div>
        <CardsList cards={cards} setId={setId} />
        {otherSets.length > 0 && <OtherSets otherSets={otherSets} />}
      </div>
    </div>
  );
};

export default StudySet;
