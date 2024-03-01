import type { Meta, StoryObj } from "@storybook/react";

import FolderPreview from ".";

const meta: Meta<typeof FolderPreview> = {
  component: FolderPreview,
};

export default meta;
type Story = StoryObj<typeof FolderPreview>;

export const Default: Story = {
  render: () => <FolderPreview title="Folder" setsCount={12} href="" />,
};
