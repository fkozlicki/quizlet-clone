import { Button } from "antd";
import Text from "antd/es/typography/Text";

interface EndScreenProps {
  time: number;
  playAgain: () => void;
}

const EndScreen = ({ time, playAgain }: EndScreenProps) => {
  return (
    <div className="flex flex-col items-center">
      <Text className="text-lg">You finished in</Text>
      <Text className="mb-4 text-2xl font-bold">{time.toFixed(1)} sec.</Text>
      <Button type="primary" size="large" onClick={playAgain}>
        Play again
      </Button>
    </div>
  );
};

export default EndScreen;
