import React from "react";

import { Button } from "@acme/ui/button";

interface StartScreenProps {
  startGame: () => void;
}

const StartScreen = ({ startGame }: StartScreenProps) => {
  return (
    <div>
      <span className="mb-2 block text-center text-2xl font-semibold">
        Are you ready?
      </span>
      <span className="mb-5 block text-center text-lg">
        Match all terms with definitions
      </span>
      <Button onClick={startGame} className="m-auto block">
        Start game
      </Button>
    </div>
  );
};

export default StartScreen;
