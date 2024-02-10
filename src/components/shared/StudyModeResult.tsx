import { Alert, Button, Progress, Typography } from "antd";
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
        <Typography.Title level={2} className="text-2xl font-bold md:text-4xl">
          Amazing! You&apos;re almost there.
        </Typography.Title>
        <div className="flex w-[45%] justify-end">
          <div className="relative h-[77px] w-[120px] md:h-[103px] md:w-[160px]">
            <Image src="/permafetti.svg" alt="" fill />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-14 md:flex-row">
        <div className="flex-1">
          <Typography.Title level={4} className="mb-4 text-xl font-bold">
            How you&apos;re doing
          </Typography.Title>
          <div className="flex items-center gap-6">
            <Progress
              type="circle"
              percent={((cardCount - hard) / cardCount) * 100}
              size={100}
              strokeWidth={12}
              format={(percent) => `${percent?.toFixed(0) ?? 0}%`}
            />
            <div className="flex flex-1 flex-col gap-2">
              <Alert
                className="rounded-full border-0  py-1 font-medium"
                message={
                  <div className="flex justify-between">
                    <span>Know</span>
                    <span>{cardCount - hard}</span>
                  </div>
                }
                type="success"
              />
              <Alert
                className="rounded-full border-0 py-1 font-medium"
                message={
                  <div className="flex justify-between">
                    <span>Learning</span>
                    <span>{hard}</span>
                  </div>
                }
                type="warning"
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Typography.Title level={4} className="mb-4 text-xl font-bold">
            Next steps
          </Typography.Title>
          <div className="flex flex-col gap-4">
            <Button onClick={firstButton.callback} className="h-28">
              <div className="flex items-center gap-4 whitespace-normal">
                {firstButton.Icon}
                <div className="flex flex-col items-start">
                  <Typography.Text className="text-base font-medium text-blue-500">
                    {firstButton.text}
                  </Typography.Text>
                  <Typography.Text className="text-start">
                    {firstButton.description}
                  </Typography.Text>
                </div>
              </div>
            </Button>
            {secondButton && (
              <Button onClick={secondButton.callback} className="h-28">
                <div className="flex items-center gap-4 whitespace-normal">
                  {secondButton.Icon}
                  <div className="flex flex-col items-start">
                    <Typography.Text className="text-base font-medium text-blue-500">
                      {secondButton.text}
                    </Typography.Text>
                    <Typography.Text className="text-start">
                      {secondButton.description}
                    </Typography.Text>
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
