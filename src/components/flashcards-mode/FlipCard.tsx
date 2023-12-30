import type { Flashcard } from "@prisma/client";
import type { RefObject } from "react";
import { useState } from "react";
import type { FlashcardAnimation } from "./FlashcardsGame";
import FlipCardContent from "./FlipCardContent";
import { theme } from "antd";

interface FlipCardProps {
  flashcard: Flashcard;
  editable: boolean;
  size?: "small" | "large";
  moveAnimation: FlashcardAnimation;
  cardWrapper: RefObject<HTMLDivElement>;
  animationCardWrapper: RefObject<HTMLDivElement>;
}

const FlipCard = ({
  flashcard,
  editable,
  size = "small",
  moveAnimation,
  cardWrapper,
  animationCardWrapper,
}: FlipCardProps) => {
  const [animation, setAnimation] = useState<"flipIn" | "flipOut" | false>(
    false
  );
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const flipCard = () => {
    setAnimation((prev) =>
      prev === false || prev === "flipOut" ? "flipIn" : "flipOut"
    );
  };

  return (
    <div className="relative flex">
      <div
        ref={animationCardWrapper}
        className={`invisible absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center rounded-lg border bg-white opacity-0`}
      >
        {moveAnimation === "know" ? (
          <div className="text-3xl font-bold text-green-400">Know</div>
        ) : (
          <div className="text-3xl font-bold text-orange-600">
            Still learning
          </div>
        )}
      </div>
      <div
        className={`w-full ${
          size === "small" ? "min-h-[21rem] sm:min-h-[25rem]" : "min-h-[40rem]"
        }`}
      >
        <div
          ref={cardWrapper}
          className={`group h-full w-full [perspective:1000px]`}
        >
          <div
            onClick={flipCard}
            className={`relative h-full w-full cursor-pointer ![animation-fill-mode:forwards] ![transform-style:preserve-3d] ${
              animation === "flipIn"
                ? "animate-flipIn"
                : animation === "flipOut"
                ? "animate-flipOut"
                : ""
            } `}
          >
            <FlipCardContent
              title="Term"
              flashcard={flashcard}
              content={flashcard.term}
              editable={editable}
            />
            <FlipCardContent
              title="Definition"
              flashcard={flashcard}
              content={flashcard.definition}
              editable={editable}
              back
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
