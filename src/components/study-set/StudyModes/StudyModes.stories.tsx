import type { Meta, StoryObj } from "@storybook/react";

import StudyModes from ".";

const meta: Meta<typeof StudyModes> = {
  component: StudyModes,
};

export default meta;
type Story = StoryObj<typeof StudyModes>;

export const Default: Story = {
  render: () => <StudyModes />,
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
  },
};
