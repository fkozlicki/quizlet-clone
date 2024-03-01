import type { Meta, StoryObj } from "@storybook/react";

import FolderCTA from ".";

const meta: Meta<typeof FolderCTA> = {
  component: FolderCTA,
};

export default meta;
type Story = StoryObj<typeof FolderCTA>;

export const Default: Story = {
  render: () => (
    <FolderCTA
      userId="123"
      defaultData={{
        id: "123",
        title: "Example folder",
        description: "Lorem ipsum",
      }}
      openAddSetModal={() => undefined}
    />
  ),
};
