import { Bars2Icon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { DragSourceMonitor } from "react-dnd/dist/types";
import type { Identifier, XYCoord } from "dnd-core";
import type { UseFormRegisterReturn } from "react-hook-form";

export interface CreateCardProps {
  id: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  term: UseFormRegisterReturn;
  definition: UseFormRegisterReturn;
  removeCallback: () => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const CreateCard = ({
  id,
  index,
  moveCard,
  term,
  definition,
  removeCallback,
}: CreateCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInputHovered, setIsInputHovered] = useState<boolean>(false);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "createcard",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "createcard",
    item: () => {
      return { id, index };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isInputHovered,
  });

  drag(drop(ref));

  return (
    <div
      className={`relative mb-2 cursor-move overflow-hidden rounded-lg sm:mb-5 opacity-${
        isDragging ? 0 : "100"
      }`}
      ref={ref}
      data-handler-id={handlerId}
    >
      <div className="">
        <div className="mb-[2px] flex items-center justify-between bg-white p-3">
          <div className="p-2">{index + 1}</div>
          <div className="flex items-center">
            <div>
              <Bars2Icon width={20} className="stroke-2" />
            </div>
            <button
              onClick={removeCallback}
              className="ml-4 p-2 hover:text-yellow-300"
            >
              <TrashIcon width={18} />
            </button>
          </div>
        </div>
        <div className="flex flex-col bg-white p-4 pt-0 sm:flex-row sm:gap-10 md:p-6 md:pt-0">
          <div className="relative z-20 flex-1 pt-5">
            <div
              className="mb-4 flex cursor-auto flex-col "
              onMouseEnter={() => setIsInputHovered(true)}
              onMouseLeave={() => setIsInputHovered(false)}
            >
              <input
                type="text"
                className="border-b-2 border-black outline-none placeholder:font-light"
                placeholder="Enter term"
                {...term}
              />
              <label
                htmlFor=""
                className="mt-[10px] text-xs font-medium uppercase text-gray-400"
              >
                Term
              </label>
            </div>
          </div>
          <div className="relative z-20 flex-1 pt-5">
            <div
              className="flex cursor-auto flex-col"
              onMouseEnter={() => setIsInputHovered(true)}
              onMouseLeave={() => setIsInputHovered(false)}
            >
              <input
                type="text"
                className="border-b-2 border-black outline-none placeholder:font-light"
                placeholder="Enter definition"
                {...definition}
              />
              <label
                htmlFor=""
                className="mt-[10px] text-xs font-medium uppercase text-gray-400"
              >
                Definition
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCard;
