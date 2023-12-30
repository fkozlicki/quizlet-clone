import { Button, Typography } from "antd";
import React from "react";

interface StartScreenProps {
  startGame: () => void;
}

const StartScreen = ({ startGame }: StartScreenProps) => {
  return (
    <div>
      <Typography.Text className="mb-2 block text-center text-2xl font-semibold">
        Are you ready?
      </Typography.Text>
      <Typography.Text className="mb-5 block text-center text-lg">
        Match all terms with definitions
      </Typography.Text>
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
