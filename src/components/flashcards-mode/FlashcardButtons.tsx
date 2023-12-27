import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ExpandOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import Link from "next/link";

interface FlashcardButtonsProps {
  cardIndex: number;
  cardCount: number;
  handleLeft: () => void;
  handleRight: () => void;
  sorting: boolean;
  setId: string;
  openSettingsModal: () => void;
}

const FlashcardButtons = ({
  handleLeft,
  handleRight,
  sorting,
  cardIndex,
  cardCount,
  setId,
  openSettingsModal,
}: FlashcardButtonsProps) => {
  return (
    <div className="relative mb-2 mt-4 flex justify-center">
      <div className="relative z-10 flex items-center gap-4">
        <Button
          onClick={handleLeft}
          disabled={!sorting && cardIndex === 0}
          icon={<ArrowLeftOutlined />}
          shape="circle"
          className="bg-transparent"
          size="large"
        />
        <div className="select-none font-semibold text-gray-500">
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
        <Tooltip title="Shuffle">
          <Button size="large" type="text" icon={<RetweetOutlined />} />
        </Tooltip>
        <div className="flex gap-2">
          <Tooltip title="Settings">
            <Button
              size="large"
              type="text"
              icon={<SettingOutlined />}
              onClick={openSettingsModal}
            />
          </Tooltip>
          <Tooltip title="Fullscreen">
            <Link href={`/study-set/${setId}/flashcards`}>
              <Button size="large" type="text" icon={<ExpandOutlined />} />
            </Link>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default FlashcardButtons;
