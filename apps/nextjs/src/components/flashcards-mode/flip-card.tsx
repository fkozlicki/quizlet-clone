"use client";

import type { AnimationScope } from "framer-motion";
import React, { useState } from "react";
import { useAnimate } from "framer-motion";

import type { RouterOutputs } from "@acme/api";
import type { Session } from "@acme/auth";
import { cn } from "@acme/ui";

import FlipCardContent from "./flip-card-content";

interface FlipCardProps {
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][0];
  editable: boolean;
  animationScope: AnimationScope<HTMLDivElement>;
  fullscreen?: boolean;
  session: Session | null;
}

const FlipCard = ({
  animationScope,
  editable,
  flashcard,
  fullscreen,
  session,
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
      role="presentation"
      onClick={flipCard}
      ref={animationScope}
      className={cn("w-full [perspective:1000px]", {
        "min-h-[21rem] sm:min-h-[25rem]": !fullscreen,
        "min-h-[40rem]": fullscreen,
      })}
    >
      <div
        ref={flipScope}
        className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
      >
        <FlipCardContent
          title="Term"
          content={flashcard.term}
          editable={editable}
          flashcard={flashcard}
          session={session}
        />
        <FlipCardContent
          title="Definition"
          content={flashcard.definition}
          editable={editable}
          flashcard={flashcard}
          session={session}
          back
        />
      </div>
    </div>
  );
};

export default FlipCard;
