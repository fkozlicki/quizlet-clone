import { Button } from "antd";
import React from "react";

interface StartScreenProps {
  startGame: () => void;
}

const StartScreen = ({ startGame }: StartScreenProps) => {
  return (
    <div>
      <div className="mb-2 text-center text-2xl font-semibold">
        Are you ready?
      </div>
      <div className="mb-5 text-center text-lg">
        Match all terms with definitions
      </div>
      <Button
        type="primary"
        size="large"
        onClick={startGame}
        className="m-auto block"
      >
        Start game
      </Button>
    </div>
  );
};

export default StartScreen;
