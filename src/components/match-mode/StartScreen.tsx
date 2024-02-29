import { Button } from "antd";
import Text from "antd/es/typography/Text";

interface StartScreenProps {
  startGame: () => void;
}

const StartScreen = ({ startGame }: StartScreenProps) => {
  return (
    <div>
      <Text className="mb-2 block text-center text-2xl font-semibold">
        Are you ready?
      </Text>
      <Text className="mb-5 block text-center text-lg">
        Match all terms with definitions
      </Text>
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
