import type { ComponentProps } from "react";
import React from "react";
import { PieChart } from "react-minimal-pie-chart";

type ResultButton = {
  Icon: (
    props: ComponentProps<"svg"> & { title?: string; titleId?: string }
  ) => JSX.Element;
  text: string;
  callback: () => Promise<void> | void;
};

interface ResultProps {
  know: number;
  learning: number;
  firstButton: ResultButton;
  secondButton?: ResultButton;
}

const Result = ({ know, learning, firstButton, secondButton }: ResultProps) => {
  return (
    <div className="mb-6 flex flex-col gap-16 md:flex-row">
      <div className="flex-1">
        <div className="mb-4 text-xl font-bold text-slate-600">
          Your results
        </div>
        <div className="flex gap-4">
          <PieChart
            data={[{ value: know, color: "#4ade80" }]}
            totalValue={know + learning}
            lineWidth={25}
            rounded
            startAngle={270}
            background="#fb923c"
            label={({ dataEntry }) => (
              <text
                dominantBaseline="central"
                x="50"
                y="50"
                dx="0"
                dy="0"
                color="red"
                textAnchor="middle"
                className="font-medium"
              >
                {dataEntry.percentage.toFixed(1)}%
              </text>
            )}
            labelStyle={{
              fontWeight: "500",
              color: "#fff",
            }}
            labelPosition={0}
            style={{
              width: "96px",
              height: "96px",
            }}
          />
          <div className="flex gap-4">
            <div className="flex flex-col justify-evenly">
              <div className="text-xl font-medium text-green-600">Know</div>
              <div className="text-xl font-medium text-orange-600">
                Still learning
              </div>
            </div>
            <div className="flex flex-col justify-evenly">
              <div className="rounded-full border border-green-300 bg-green-100 px-4 text-xl font-medium text-green-600">
                {know}
              </div>
              <div className="rounded-full border border-orange-300 bg-orange-100 px-4 text-xl font-medium text-orange-600">
                {learning}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="mb-4 text-xl font-bold text-slate-600">Next steps</div>
        <div className="flex flex-col gap-4">
          <button
            onClick={firstButton.callback}
            className="flex gap-4 rounded-lg border-2 border-transparent bg-white p-4 shadow-md hover:border-slate-300"
          >
            <firstButton.Icon width={28} />
            <div>{firstButton.text}</div>
          </button>
          {secondButton && (
            <button
              onClick={secondButton.callback}
              className="flex gap-4 rounded-lg border-2 border-transparent bg-white p-4 shadow-md hover:border-slate-300"
            >
              <secondButton.Icon width={28} />
              <div>{secondButton.text}</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
