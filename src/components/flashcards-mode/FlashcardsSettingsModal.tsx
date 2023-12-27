import { Button, Divider, Modal, Switch } from "antd";
import React from "react";

interface FlashcardsSettingsModalProps {
  open: boolean;
  onCancel: () => void;
  sorting: boolean;
  switchSorting: (value: boolean) => void;
  resetFlashcards: () => void;
}

const FlashcardsSettingsModal = ({
  open,
  onCancel,
  sorting,
  switchSorting,
  resetFlashcards,
}: FlashcardsSettingsModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Options"
      centered
      classNames={{
        header: "[&>div]:text-3xl mb-6",
        footer: "hidden",
      }}
      width={700}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-medium">Cards sorting</div>
          <div>
            Divides cards into two groups - easy and hard. You can then play on
            hard ones only.
          </div>
        </div>
        <Switch value={sorting} onChange={switchSorting} />
      </div>
      <Divider />
      <div className="flex items-center justify-between">
        <div className="text-base font-medium">Study only starred terms</div>
        <Switch />
      </div>
      <Divider />
      <div>
        <Button
          onClick={resetFlashcards}
          type="link"
          danger
          size="large"
          className="pl-0 font-medium"
        >
          Restart Flashcards
        </Button>
      </div>
    </Modal>
  );
};

export default FlashcardsSettingsModal;
