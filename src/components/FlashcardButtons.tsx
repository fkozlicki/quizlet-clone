import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button, Switch } from "antd";
import type { SwitchChangeEventHandler } from "antd/es/switch";
import React from "react";

interface FlashcardButtonsProps {
  handleLeft: () => void;
  handleRight: () => void;
  switchMode: SwitchChangeEventHandler;
  learn: boolean;
  cardIndex: number;
  cardCount: number;
}

const FlashcardButtons = ({
  handleLeft,
  handleRight,
  learn,
  cardIndex,
  cardCount,
  switchMode,
}: FlashcardButtonsProps) => {
  return (
    <div className="relative mb-2 mt-4 flex justify-center">
      <div className="relative z-10 flex items-center gap-4">
        <Button
          onClick={handleLeft}
          disabled={!learn && cardIndex === 0}
          icon={<ArrowLeftOutlined />}
          shape="circle"
          className="bg-transparent"
          size="large"
        />
        <div className="font-semibold text-gray-500">
          {cardIndex + 1}/{cardCount}
        </div>
        <Button
          onClick={handleRight}
          disabled={cardIndex === cardCount}
          icon={<ArrowRightOutlined />}
          shape="circle"
          className="bg-transparent"
          size="large"
        />
      </div>
      <div className="absolute top-0 flex h-full w-full items-center justify-between">
        <div></div>
        <Switch
          checkedChildren="learn"
          unCheckedChildren="view"
          onChange={switchMode}
          value={learn}
        />
      </div>
    </div>
  );
};

export default FlashcardButtons;
