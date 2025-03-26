"use client";

import { useFlashcardsModeContext } from "~/contexts/flashcards-mode-context";

const MessageCard = () => {
  const { messageRef, know } = useFlashcardsModeContext();

  return (
    <div
      ref={messageRef}
      className="invisible absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center rounded-lg bg-secondary opacity-0 shadow"
    >
      <div
        className={`text-3xl font-bold ${know ? "text-green-400" : "text-orange-600"}`}
      >
        {know ? "Know" : "Still learning"}
      </div>
    </div>
  );
};

export default MessageCard;
