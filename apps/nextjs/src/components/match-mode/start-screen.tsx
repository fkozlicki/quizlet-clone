import { Button } from "@acme/ui/button";

import { useMatchModeContext } from "~/contexts/match-mode-context";

const StartScreen = () => {
  const { start } = useMatchModeContext();

  return (
    <div>
      <span className="mb-2 block text-center text-2xl font-semibold">
        Are you ready?
      </span>
      <span className="mb-5 block text-center text-lg">
        Match all terms with definitions
      </span>
      <Button onClick={start} className="m-auto block">
        Start game
      </Button>
    </div>
  );
};

export default StartScreen;
