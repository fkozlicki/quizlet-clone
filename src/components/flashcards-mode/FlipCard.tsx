import type { Flashcard } from "@prisma/client";
import { useAnimate, type AnimationScope } from "framer-motion";
import { useState } from "react";
import FlipCardContent from "./FlipCardContent";

interface FlipCardProps {
  flashcard: Flashcard;
  editable: boolean;
  size?: "small" | "large";
  animationScope: AnimationScope<HTMLDivElement>;
}

const FlipCard = ({
  flashcard,
  editable,
  size = "small",
  animationScope,
}: FlipCardProps) => {
  const [flipScope, flipAnimate] = useAnimate<HTMLDivElement>();
  const [flipped, setFlipped] = useState<boolean>(false);

  const flipCard = () => {
    if (flipped) {
      void flipAnimate(flipScope.current, { rotateX: [0, 180] });
    } else {
      void flipAnimate(flipScope.current, { rotateX: [180, 360] });
    }
    setFlipped((prev) => !prev);
  };

  return (
    <div
      onClick={flipCard}
      ref={animationScope}
      className={`w-full [perspective:1000px] ${
        size === "small" ? "min-h-[21rem] sm:min-h-[25rem]" : "min-h-[40rem]"
      }`}
    >
      <div
        ref={flipScope}
        className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
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
  );
};

export default FlipCard;
