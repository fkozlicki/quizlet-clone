import React from "react";

interface StartScreenProps {
  startGame: () => void;
}

const StartScreen = ({ startGame }: StartScreenProps) => {
  return (
    <div>
      <h1 className="mb-2 text-center text-2xl font-semibold">
        Are you ready?
      </h1>
      <p className="mb-5 text-center text-lg">
        Match all terms with definitions
      </p>
      <button
        onClick={startGame}
        className="m-auto block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Start game
      </button>
    </div>
  );
};

export default StartScreen;
