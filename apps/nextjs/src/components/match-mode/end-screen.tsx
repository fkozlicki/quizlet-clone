import React from "react";

import { Button } from "@acme/ui/button";

interface EndScreenProps {
  time: number;
  playAgain: () => void;
}

const EndScreen = ({ time, playAgain }: EndScreenProps) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg">You finished in</span>
      <span className="mb-4 text-2xl font-bold">{time.toFixed(1)} sec.</span>
      <Button onClick={playAgain}>Play again</Button>
    </div>
  );
};

export default EndScreen;
