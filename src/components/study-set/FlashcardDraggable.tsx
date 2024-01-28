import { BarsOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, theme } from "antd";
import type { Identifier, XYCoord } from "dnd-core";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { DragSourceMonitor } from "react-dnd/dist/types";
import type { Control } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import type { CreateStudySetValues } from "../../schemas/study-set";

export interface FlashcardDraggableProps {
  remove: (index: number) => void;
  swap: (from: number, to: number) => void;
  id: string;
  index: number;
  control: Control<CreateStudySetValues>;
  cardsCount: number;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const FlashcardDraggable = ({
  remove,
  swap,
  id,
  index,
  control,
  cardsCount,
}: FlashcardDraggableProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "FlashcardDraggable",
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
      swap(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "FlashcardDraggable",
    item: () => {
      return { id, index };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const {
    token: { colorBorder },
  } = theme.useToken();

  drag(drop(ref));

  return (
    <Card
      ref={ref}
      data-handler-id={handlerId}
      style={{
        border: colorBorder,
        opacity: isDragging ? 0 : 100,
      }}
      extra={
        <div className="flex items-center">
          <Button
            icon={<BarsOutlined />}
            type="text"
            className="cursor-default"
          />
          <Button
            onClick={() => remove(index)}
            icon={<DeleteOutlined />}
            type="text"
            disabled={cardsCount < 3}
          />
        </div>
      }
      title={index + 1}
    >
      <Flex className="gap-8">
        <FormItem
          control={control}
          name={`cards.${index}.term`}
          label="term"
          className="mb-0 flex-1"
        >
          <Input placeholder="Enter term" />
        </FormItem>
        <FormItem
          control={control}
          name={`cards.${index}.definition`}
          label="definition"
          className="mb-0 flex-1"
        >
          <Input placeholder="Enter definition" />
        </FormItem>
      </Flex>
    </Card>
  );
};

export default FlashcardDraggable;
