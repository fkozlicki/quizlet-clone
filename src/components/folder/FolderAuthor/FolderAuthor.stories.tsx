import type { Meta, StoryObj } from "@storybook/react";

import FolderAuthor from ".";

const meta: Meta<typeof FolderAuthor> = {
  component: FolderAuthor,
};

export default meta;
type Story = StoryObj<typeof FolderAuthor>;

export const Default: Story = {
  render: () => (
    <FolderAuthor
      user={{
        id: "123",
        image: null,
        name: "John Doe",
      }}
      setsCount={12}
    />
  ),
};
