import { Alert, Button, Progress } from "antd";
import Image from "next/image";
import type { ReactNode } from "react";

type ResultButton = {
  Icon: ReactNode;
  text: string;
  description: string;
  callback: () => Promise<void> | void;
};

interface StudyModeResultProps {
  hard: number;
  cardCount: number;
  firstButton: ResultButton;
  secondButton?: ResultButton;
}

const StudyModeResult = ({
  hard,
  cardCount,
  firstButton,
  secondButton,
}: StudyModeResultProps) => {
  return (
    <div className="mb-6">
      <div className="mb-6 flex">
        <div className="text-2xl font-bold text-slate-800 md:text-4xl">
          Amazing! You&apos;re almost there.
        </div>
        <div className="flex w-[45%] justify-end">
          <div className="relative h-[77px] w-[120px] md:h-[103px] md:w-[160px]">
            <Image src="/permafetti.svg" alt="" fill />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-14 md:flex-row">
        <div className="flex-1">
          <div className="mb-4 text-xl font-bold text-gray-600">
            How you&apos;re doing
          </div>
          <div className="flex items-center gap-6">
            <Progress
              type="circle"
              percent={((cardCount - hard) / cardCount) * 100}
              size={100}
              strokeWidth={12}
              format={(percent) => `${percent ?? 0}%`}
            />
            <div className="flex flex-1 flex-col gap-2">
              <Alert
                className="rounded-full border-0 bg-green-200 py-1 font-medium text-green-700"
                message={
                  <div className="flex justify-between">
                    <span>Know</span>
                    <span>{cardCount - hard}</span>
                  </div>
                }
                type="success"
              />
              <Alert
                className="rounded-full border-0 bg-orange-200 py-1 font-medium text-orange-700"
                message={
                  <div className="flex justify-between">
                    <span>Learning</span>
                    <span>{hard}</span>
                  </div>
                }
                type="warning"
              />
              <Alert
                className="rounded-full border-0 bg-gray-200 py-1 font-medium text-gray-600"
                message={
                  <div className="flex justify-between">
                    <span>Terms left</span>
                    <span>{0}</span>
                  </div>
                }
                type="info"
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-4 text-xl font-bold text-gray-600">Next steps</div>
          <div className="flex flex-col gap-4">
            <Button onClick={firstButton.callback} className="h-28">
              <div className="flex items-center gap-4 whitespace-normal">
                {firstButton.Icon}
                <div className="flex flex-col items-start">
                  <span className="text-base font-medium text-blue-500">
                    {firstButton.text}
                  </span>
                  <span className="text-start text-black">
                    {firstButton.description}
                  </span>
                </div>
              </div>
            </Button>
            {secondButton && (
              <Button onClick={secondButton.callback} className="h-28">
                <div className="flex items-center gap-4 whitespace-normal">
                  {secondButton.Icon}
                  <div className="flex flex-col items-start">
                    <span className="text-base font-medium text-blue-500">
                      {secondButton.text}
                    </span>
                    <span className="text-black">
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

export default StudyModeResult;
