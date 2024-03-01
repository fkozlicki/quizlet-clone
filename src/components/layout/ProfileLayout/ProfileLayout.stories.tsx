import type { Meta, StoryObj } from "@storybook/react";

import ProfileLayout from ".";

const meta: Meta<typeof ProfileLayout> = {
  component: ProfileLayout,
};

export default meta;
type Story = StoryObj<typeof ProfileLayout>;

export const Default: Story = {
  render: () => (
    <ProfileLayout
      user={{ id: "123", name: "John Doe", image: null }}
      session={{ user: { id: "123" }, expires: "" }}
    >
      {""}
    </ProfileLayout>
  ),
};
