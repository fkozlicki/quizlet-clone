import { Card, theme } from "antd";

interface MemoryCardProps {
  index: number;
  content: string;
  selectCallback: () => void;
}

const MemoryCard = ({ index, content, selectCallback }: MemoryCardProps) => {
  const {
    token: { colorBorder },
  } = theme.useToken();

  return (
    <Card
      id={`card-${index}`}
      onClick={selectCallback}
      className="cursor-pointer rounded border-2"
      style={{ borderColor: colorBorder }}
      classNames={{
        body: "flex min-h-[10rem] items-center justify-center font-medium",
      }}
    >
      {content}
    </Card>
  );
};

export default MemoryCard;
