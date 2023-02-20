import React from "react";

interface EndScreenProps {
  time: number;
  playAgain: () => void;
}

const EndScreen = ({ time, playAgain }: EndScreenProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-lg">You finished in</div>
      <div className="mb-4 text-2xl font-bold">{time.toFixed(1)} sec.</div>
      {/* IF RECORD => RECORD */}
      {/* <div className="text-lg">Your best score is {}</div> */}
      <button
        onClick={playAgain}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Play again
      </button>
    </div>
  );
};

export default EndScreen;
