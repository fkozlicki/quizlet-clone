"use client";

import type { AnimationScope } from "framer-motion";
import React, { useState } from "react";
import { motion } from "framer-motion";

import type { RouterOutputs } from "@acme/api";
import type { Session } from "@acme/auth";
import { cn } from "@acme/ui";

import FlipCardContent from "./flip-card-content";

interface FlipCardProps {
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][number];
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
  const [animation, setAnimation] = useState<
    "flipIn" | "flipOut" | undefined
  >();

  const toggleFlip = () => {
    setAnimation((prev) =>
      !prev || prev === "flipOut" ? "flipIn" : "flipOut",
    );
  };

  const flipVariants = {
    flipIn: {
      rotateX: [0, 180],
    },
    flipOut: {
      rotateX: [180, 360],
    },
  };

  return (
    <div
      role="presentation"
      onClick={toggleFlip}
      ref={animationScope}
      className={cn("w-full [perspective:1000px]", {
        "min-h-[21rem] sm:min-h-[25rem]": !fullscreen,
        "min-h-[40rem]": fullscreen,
      })}
    >
      <motion.div
        variants={flipVariants}
        animate={animation}
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
      </motion.div>
    </div>
  );
};

export default FlipCard;
