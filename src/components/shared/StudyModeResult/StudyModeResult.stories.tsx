import type { Meta, StoryObj } from "@storybook/react";

import StudyModeResult from ".";
import { ReloadOutlined, RollbackOutlined } from "@ant-design/icons";

const meta: Meta<typeof StudyModeResult> = {
  component: StudyModeResult,
};

export default meta;
type Story = StoryObj<typeof StudyModeResult>;

export const Default: Story = {
  render: () => (
    <StudyModeResult
      cardCount={12}
      hard={2}
      firstButton={{
        text: "Learn with new set",
        description: "Learn with new set",
        Icon: <ReloadOutlined className="text-4xl" />,
        callback: () => undefined,
      }}
    />
  ),
};

export const TwoButtons: Story = {
  render: () => (
    <StudyModeResult
      cardCount={12}
      hard={2}
      firstButton={{
        text: "Learn with new set",
        description: "Learn with new set",
        Icon: <ReloadOutlined className="text-4xl" />,
        callback: () => undefined,
      }}
      secondButton={{
        text: "Back to study set",
        description: "Back to study set",
        Icon: <RollbackOutlined className="text-4xl" />,
        callback: () => undefined,
      }}
    />
  ),
};
