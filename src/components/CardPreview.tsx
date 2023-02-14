import { PencilIcon, StarIcon } from "@heroicons/react/24/solid";
import React from "react";

interface CardPreviewProps {
  term: string;
  definition: string;
}

const CardPreview = ({ term, definition }: CardPreviewProps) => {
  return (
    <div className="flex flex-col gap-4 rounded bg-white p-4 drop-shadow sm:flex-row sm:items-center">
      <div className="order-2 flex justify-end gap-4">
        <button>
          <StarIcon width={20} className="text-slate-600" />
        </button>
        <button>
          <PencilIcon width={20} className="text-slate-600" />
        </button>
      </div>
      <div className="border-slate-200 sm:basis-2/5 sm:border-r sm:pr-8">
        {term}
      </div>
      <div className="sm:basis-3/5 sm:px-8">{definition}</div>
    </div>
  );
};

export default CardPreview;
