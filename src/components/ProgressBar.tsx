import React from "react";

interface ProgessBarProps {
  value: number;
  max: number;
}

const ProgressBar = ({ value, max }: ProgessBarProps) => {
  return (
    <div className="mb-6 h-1 w-full rounded-full bg-gray-200">
      <div
        className={`h-1 w-1/4 rounded-full bg-gray-500 transition-[width]`}
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
