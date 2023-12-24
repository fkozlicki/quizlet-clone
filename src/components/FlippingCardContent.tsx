import { EditOutlined, StarFilled } from "@ant-design/icons";
import { Button } from "antd";
import type { MouseEventHandler } from "react";

interface FlippingCardContentProps {
  content: string;
  title: string;
  openEditModal?: () => void;
  editable: boolean;
  back?: boolean;
}

const FlippingCardContent = ({
  content,
  title,
  openEditModal,
  editable,
  back,
}: FlippingCardContentProps) => {
  const handleOpenEdit: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    openEditModal && openEditModal();
  };

  const handleAddToFavourites: MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className={`absolute h-full w-full [backface-visibility:hidden] ${
        back ? "[transform:rotateX(180deg)]" : ""
      }`}
    >
      <div className="flex h-full w-full flex-col rounded-lg bg-white p-4 drop-shadow-lg md:p-6">
        <div className="flex items-center justify-between">
          <div className="font-medium text-slate-400">{title}</div>
          <div className="flex justify-end gap-2">
            {editable && openEditModal && (
              <Button
                icon={<EditOutlined />}
                type="text"
                onClick={handleOpenEdit}
              />
            )}
            <Button
              onClick={handleAddToFavourites}
              icon={<StarFilled />}
              type="text"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center text-3xl">
          {content}
        </div>
      </div>
    </div>
  );
};
export default FlippingCardContent;
