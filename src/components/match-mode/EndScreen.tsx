import { Button, Typography } from "antd";
import React from "react";

interface EndScreenProps {
  time: number;
  playAgain: () => void;
}

const EndScreen = ({ time, playAgain }: EndScreenProps) => {
  return (
    <div className="flex flex-col items-center">
      <Typography.Text className="text-lg">You finished in</Typography.Text>
      <Typography.Text className="mb-4 text-2xl font-bold">
        {time.toFixed(1)} sec.
      </Typography.Text>
      <Button type="primary" size="large" onClick={playAgain}>
        Play again
      </Button>
    </div>
  );
};

export default EndScreen;
