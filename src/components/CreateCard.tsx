import { Bars2Icon, TrashIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { DragSourceMonitor } from "react-dnd/dist/types";
import type { Identifier, XYCoord } from "dnd-core";

export interface CreateCardProps {
  id: number;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const CreateCard = ({ id, index, moveCard }: CreateCardProps) => {
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
      className={`relative mb-2 cursor-move rounded-lg bg-white p-4 opacity-${
        isDragging ? 0 : "100"
      }`}
      ref={ref}
      data-handler-id={handlerId}
    >
      <div className="flex flex-col">
        <div className="mb-4">
          <div
            className="relative z-20"
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
          >
            <div className="mb-4 flex flex-col pt-5">
              <input
                type="text"
                className="mb-1 border-b-2 border-black outline-none placeholder:font-light"
                placeholder="Enter term"
              />
              <label
                htmlFor=""
                className="text-xs font-medium uppercase text-gray-400"
              >
                Term
              </label>
            </div>
          </div>
          <div
            className="relative z-20"
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
          >
            <div className="flex flex-col pt-5">
              <input
                type="text"
                className="mb-1 border-b-2 border-black outline-none placeholder:font-light "
                placeholder="Enter term"
              />
              <label
                htmlFor=""
                className="text-xs font-medium uppercase text-gray-400"
              >
                Term
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div>{index + 1}</div>
          <div className="flex">
            <div>
              <Bars2Icon width={24} />
            </div>
            <div>
              <TrashIcon width={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCard;
