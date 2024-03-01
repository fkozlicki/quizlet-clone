import type { Meta, StoryObj } from "@storybook/react";

import CreatedBy from ".";

const meta: Meta<typeof CreatedBy> = {
  component: CreatedBy,
};

export default meta;
type Story = StoryObj<typeof CreatedBy>;

export const Default: Story = {
  render: () => (
    <CreatedBy
      user={{
        id: "123",
        image: null,
        name: "John Doe",
      }}
    />
  ),
};
