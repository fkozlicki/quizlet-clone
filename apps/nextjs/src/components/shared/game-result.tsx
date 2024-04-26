import type { ReactNode } from "react";
import React from "react";
import Image from "next/image";

import { Alert, AlertDescription, AlertTitle } from "@acme/ui/alert";
import { Button } from "@acme/ui/button";
import { RadialProgress } from "@acme/ui/radial-progress";

interface ResultButton {
  Icon: ReactNode;
  text: string;
  description: string;
  callback: () => Promise<void> | void;
}

interface GameResultProps {
  hard: number;
  cardCount: number;
  firstButton: ResultButton;
  secondButton?: ResultButton;
}

const GameResult = ({
  hard,
  cardCount,
  firstButton,
  secondButton,
}: GameResultProps) => {
  const progressValue = +(((cardCount - hard) / cardCount) * 100).toFixed(0);

  return (
    <div className="mb-6">
      <div className="mb-6 flex">
        <h2 className="text-2xl font-bold md:text-4xl">
          Amazing! You&apos;re almost there.
        </h2>
        <div className="flex w-[45%] justify-end">
          <div className="relative h-[77px] w-[120px] md:h-[103px] md:w-[160px]">
            <Image src="/permafetti.svg" alt="" fill />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex-1">
          <h3 className="mb-4 text-xl font-bold">How you&apos;re doing</h3>
          <div className="flex items-center gap-6">
            <RadialProgress value={progressValue} size={100} strokeWidth={12} />
            <div className="flex flex-1 flex-col gap-2">
              <Alert className="flex items-center justify-between">
                <AlertTitle className="mb-0">Know</AlertTitle>
                <AlertDescription>{cardCount - hard}</AlertDescription>
              </Alert>
              <Alert className="flex items-center justify-between">
                <AlertTitle className="mb-0">Learning</AlertTitle>
                <AlertDescription>{hard}</AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="mb-4 text-xl font-bold">Next steps</h3>
          <div className="flex flex-col gap-4">
            <Button
              onClick={firstButton.callback}
              className="h-[100px] justify-start"
            >
              <div className="flex items-center gap-4 whitespace-normal">
                {firstButton.Icon}
                <div className="flex flex-col items-start">
                  <span className="text-base font-medium text-blue-500">
                    {firstButton.text}
                  </span>
                  <span className="text-start">{firstButton.description}</span>
                </div>
              </div>
            </Button>
            {secondButton && (
              <Button
                onClick={secondButton.callback}
                className="h-[100px] justify-start"
              >
                <div className="flex items-center gap-4 whitespace-normal">
                  {secondButton.Icon}
                  <div className="flex flex-col items-start">
                    <span className="text-base font-medium text-blue-500">
                      {secondButton.text}
                    </span>
                    <span className="text-start">
                      {secondButton.description}
                    </span>
                  </div>
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
