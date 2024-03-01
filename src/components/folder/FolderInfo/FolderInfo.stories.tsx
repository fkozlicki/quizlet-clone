import type { Meta, StoryObj } from "@storybook/react";

import FolderInfo from ".";

const meta: Meta<typeof FolderInfo> = {
  component: FolderInfo,
};

export default meta;
type Story = StoryObj<typeof FolderInfo>;

export const Default: Story = {
  render: () => (
    <FolderInfo
      title="Example folder"
      description="Lorem ipsum dolor sit amet"
    />
  ),
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
  },
};
