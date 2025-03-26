import { Button } from "@acme/ui/button";

import { useMatchModeContext } from "~/contexts/match-mode-context";

const EndScreen = () => {
  const { reset, ellapsedTime } = useMatchModeContext();

  return (
    <div className="flex flex-col items-center">
      <span className="text-lg">You finished in</span>
      <span className="mb-4 text-2xl font-bold">
        {ellapsedTime.toFixed(1)} sec.
      </span>
      <Button onClick={reset}>Play again</Button>
    </div>
  );
};

export default EndScreen;
