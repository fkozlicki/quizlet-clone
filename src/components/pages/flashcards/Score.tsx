import React from "react";

interface ScoreProps {
  know: number;
  learning: number;
}

const Score = ({ know, learning }: ScoreProps) => {
  return (
    <div className="mb-6 flex justify-between">
      <div className="flex items-center gap-2 font-medium text-orange-600">
        <span className="rounded-full border border-orange-300 bg-orange-100 px-3">
          {learning}
        </span>
        <span>Still learning</span>
      </div>
      <div className="flex items-center gap-2 font-medium text-green-600">
        Know
        <span className="rounded-full border border-green-300 bg-green-100 px-3">
          {know}
        </span>
      </div>
    </div>
  );
};

export default Score;
