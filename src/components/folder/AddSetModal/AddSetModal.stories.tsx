import type { Meta, StoryObj } from "@storybook/react";

import AddSetModal from ".";

const meta: Meta<typeof AddSetModal> = {
  component: AddSetModal,
};

export default meta;
type Story = StoryObj<typeof AddSetModal>;

export const Default: Story = {
  render: () => (
    <AddSetModal
      open={true}
      closeModal={() => undefined}
      folderId="123"
      setsInFolder={[]}
      slug="first-folder"
      userId="123"
    />
  ),
};
