import type { Meta, StoryObj } from "@storybook/react";

import FolderSkeleton from ".";

const meta: Meta<typeof FolderSkeleton> = {
  component: FolderSkeleton,
};

export default meta;
type Story = StoryObj<typeof FolderSkeleton>;

export const Default: Story = {
  render: () => <FolderSkeleton />,
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
  },
};
