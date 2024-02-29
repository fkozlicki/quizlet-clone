import type { Meta, StoryObj } from "@storybook/react";

import IconCard from ".";

const meta: Meta<typeof IconCard> = {
  component: IconCard,
};

export default meta;
type Story = StoryObj<typeof IconCard>;

export const Default: Story = {
  render: () => <IconCard icon="/study.png" text="Learn" href="/" />,
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
  },
};
