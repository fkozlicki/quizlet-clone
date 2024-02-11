import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  CloseOutlined,
  ExpandOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import Link from "next/link";
import Text from "antd/es/typography/Text";

interface FlashcardButtonsProps {
  cardIndex: number;
  cardCount: number;
  sorting: boolean;
  setId: string;
  handleLeft: () => void;
  handleRight: () => void;
  openSettingsModal: () => void;
  shuffle: () => void;
}

const FlashcardButtons = ({
  sorting,
  cardIndex,
  cardCount,
  setId,
  handleLeft,
  handleRight,
  shuffle,
  openSettingsModal,
}: FlashcardButtonsProps) => {
  return (
    <div className="relative mb-2 mt-4 flex justify-center">
      <div className="relative z-10 flex items-center gap-4">
        <Button
          onClick={handleLeft}
          disabled={!sorting && cardIndex === 0}
          icon={sorting ? <CloseOutlined /> : <ArrowLeftOutlined />}
          shape="circle"
          className={`bg-transparent ${
            sorting ? "hover:border-red-500 hover:text-red-500" : ""
          }`}
          size="large"
        />
        <Text className="select-none font-semibold tracking-[0.4em] text-gray-500">
          {cardIndex + 1}/{cardCount}
        </Text>
        <Button
          onClick={handleRight}
          disabled={cardIndex === cardCount}
          icon={sorting ? <CheckOutlined /> : <ArrowRightOutlined />}
          shape="circle"
          className={`bg-transparent ${
            sorting ? "hover:border-green-600 hover:text-green-600" : ""
          }`}
          size="large"
        />
      </div>
      <div className="absolute top-0 flex h-full w-full items-center justify-between">
        <Tooltip title="Shuffle">
          <Button
            onClick={shuffle}
            size="large"
            type="text"
            icon={<RetweetOutlined />}
          />
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
