import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import React, { type MouseEvent } from "react";

interface FlippingCardContentProps {
  content: string;
  title: string;
  openEditing: (e: MouseEvent) => void;
  index: number;
  isEditable: boolean;
  leftButtonCallback: (event: MouseEvent) => void;
  rightButtonCallback: (event: MouseEvent) => void;
  buttonVariant: "chevron" | "description";
  count: number;
}

const FlippingCardContent = ({
  index,
  content,
  title,
  openEditing,
  isEditable,
  buttonVariant,
  leftButtonCallback,
  rightButtonCallback,
  count,
}: FlippingCardContentProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div className="flex-1 font-medium text-slate-400">{title}</div>
        <div className="flex flex-1 justify-center">
          {index + 1} / {count}
        </div>
        <div className="flex flex-1 justify-end gap-2">
          {isEditable && (
            <button
              onClick={openEditing}
              className="rounded-full p-2 text-slate-500 hover:bg-gray-100 hover:text-slate-800"
            >
              <PencilIcon width={16} />
            </button>
          )}
          <button className="rounded-full p-2 text-slate-500 hover:bg-gray-100 hover:text-slate-800">
            <StarIcon width={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center text-3xl">
        {content}
      </div>
      <div className="flex gap-4">
        <button
          onClick={leftButtonCallback}
          className="z-50 flex flex-1 justify-center rounded-md border-2 px-4 py-3 hover:border-slate-400 disabled:text-slate-400 disabled:hover:border-slate-200 md:py-4"
          disabled={buttonVariant === "chevron" && index <= 0}
        >
          {buttonVariant === "chevron" ? (
            <ChevronLeftIcon className="md h-5 w-5" />
          ) : (
            <div>Don&apos;t know</div>
          )}
        </button>
        <button
          onClick={rightButtonCallback}
          className="z-50 flex flex-1 justify-center rounded-md border-2 px-4 py-3 hover:border-slate-400 disabled:text-gray-400 disabled:hover:border-slate-200 md:py-4"
          disabled={buttonVariant === "chevron" && index >= count}
        >
          {buttonVariant === "chevron" ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <div>Know</div>
          )}
        </button>
      </div>
    </div>
  );
};
export default FlippingCardContent;
