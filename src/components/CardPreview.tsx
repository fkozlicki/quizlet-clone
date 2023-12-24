import { EditOutlined, StarFilled } from "@ant-design/icons";
import type { Flashcard } from "@prisma/client";
import { Button } from "antd";

interface CardPreviewProps {
  flashcard: Flashcard;
  openEditModal: () => void;
}

const CardPreview = ({ flashcard, openEditModal }: CardPreviewProps) => {
  return (
    <div className="flex flex-col gap-4 rounded bg-white p-4 drop-shadow sm:flex-row sm:items-center">
      <div className="order-2 flex justify-end gap-1">
        <Button onClick={openEditModal} type="text" icon={<EditOutlined />} />
        <Button type="text" icon={<StarFilled />} />
      </div>
      <div className="border-slate-200 sm:basis-2/5 sm:border-r sm:pr-8">
        {flashcard.term}
      </div>
      <div className="sm:basis-3/5 sm:px-8">{flashcard.definition}</div>
    </div>
  );
};

export default CardPreview;
